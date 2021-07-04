import {
	Injectable,
	Logger,
	mixin,
	NotFoundException,
	OnModuleInit,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';
import { HttpAdapterHost, ModuleRef } from '@nestjs/core';
import passport from 'passport';
import { AVAILABLE_STRATEGIES } from './available-strategies.constant';
import { Application } from 'express';

@Injectable()
export class StrategiesService implements OnModuleInit {
	private logger = new Logger(StrategiesService.name);

	constructor(
		private prisma: DatabaseService,
		private moduleRef: ModuleRef,
		private adapterHost: HttpAdapterHost
	) {}

	async onModuleInit() {
		await this.createStrategyRoutes();
		await this.reloadStrategies();
	}

	private async createStrategyRoutes() {
		const httpAdapter = this.adapterHost.httpAdapter;
		const instance = httpAdapter.getInstance<Application>();

		for (const strategy of AVAILABLE_STRATEGIES) {
		}
	}

	async reloadStrategies() {
		const strategies = await this.getAll();

		// Unload all strategies
		strategies.forEach((strategy) => passport.unuse(strategy));

		for (const strategy of AVAILABLE_STRATEGIES) {
			const config = await this.getConfig(strategy.name);
			if (!config) {
				this.logger.error(
					`No config was found for enabled strategy ${strategy.name}. The strategy was not loaded`
				);
				continue;
			}
			await this.moduleRef.create(mixin(strategy.init(config as never)));
			this.logger.log(`Loaded strategy ${strategy.name}`);
		}
		this.logger.log('Reloaded all authentication strategies');
	}

	async getEnabled() {
		return (
			await this.prisma.strategy.findMany({
				where: { enabled: true },
				select: { name: true },
			})
		).map((strategy) => strategy.name);
	}

	async getAll() {
		return (
			await this.prisma.strategy.findMany({ select: { name: true } })
		).map((strategy) => strategy.name);
	}

	async get(name: string) {
		const strategy = await this.prisma.strategy.findUnique({
			where: { name },
		});
		if (!strategy)
			throw new NotFoundException('The strategy provided was not found');
		return strategy;
	}

	async isEnabled(name: string) {
		return (await this.get(name)).enabled;
	}

	async getConfig<T>(name: string) {
		return (await this.get(name)).config as T | null;
	}

	async setConfig(name: string, config: Prisma.JsonValue) {
		await this.prisma.strategy.update({ where: { name }, data: { config } });
	}

	async canSelfRegister(name: string) {
		return (await this.get(name)).selfRegistration;
	}
}
