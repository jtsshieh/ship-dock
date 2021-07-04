import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	Redirect,
	Req,
} from '@nestjs/common';
import { SetupDto } from './dto/setup.dto';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import {
	ClearCookie,
	ClearCookieFunc,
	Cookies,
	SetCookie,
	SetCookieFunc,
} from '@nest-extensions/cookies';
import { User } from './decorators/user.decorator';
import { UseAuthGuard } from './decorators/use-auth-guard.decorator';
import { User as UserModel } from '@prisma/client';
import { UserProfileDto } from './dto/user-profile.dto';
import { SettingsService } from '../settings/settings.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { JwtGeneratorService } from './jwt-generator/jwt-generator.service';
import { UseJwtAuth } from './decorators/use-jwt-auth.decorator';

@Controller('api/auth')
export class AuthenticationController {
	constructor(
		private jwtGeneratorService: JwtGeneratorService,
		private userService: UsersService,
		private settingsService: SettingsService,
		private configService: ConfigService
	) {}

	@Get('discord')
	@UseAuthGuard('discord', { prompt: 'none' })
	@Redirect()
	discord() {
		return {
			url: this.configService.get('FRONTEND_URL') + '/app',
		};
	}

	@Get('google')
	@UseAuthGuard('google')
	@Redirect()
	google() {
		return {
			url: this.configService.get('FRONTEND_URL') + '/app',
		};
	}

	@Post('local')
	@UseAuthGuard('local')
	local() {
		return {};
	}

	@Get('profile')
	@UseJwtAuth()
	getProfile(@User() user: UserModel): UserProfileDto {
		return {
			name: user.name,
			id: user.id,
			email: user.email,
			username: user.username,
		};
	}

	@Get('setup')
	isSetup(): Promise<boolean> {
		return this.settingsService.isSetup();
	}

	@Post('logout')
	logout(@ClearCookie() clearCookie: ClearCookieFunc): void {
		clearCookie('access_token');
	}

	@Post('setup')
	async setup(@Body() body: SetupDto, @SetCookie() setCookie: SetCookieFunc) {
		if (await this.settingsService.isSetup())
			throw new BadRequestException('Already set up');

		const user = await this.userService.create(body.name, 'admin', body.email, {
			strategyName: 'local',
			details: {
				password: await bcrypt.hash(body.password, 10),
			},
		});
		setCookie(
			'access_token',
			await this.jwtGeneratorService.createAccessToken(user)
		);
		await this.settingsService.setSetup();
	}

	@Get('creation-token')
	creationToken(
		@Req() req: Request,
		@Cookies('creation_token') creationToken: string
	) {
		return this.jwtGeneratorService.decodeCreationToken(creationToken);
	}

	@Get('username-available')
	async isUsernameAvailable(@Query('username') username: string) {
		return this.userService.isUsernameAvailable(username);
	}

	@Post('create-account')
	async createAccount(
		@Body() body: CreateAccountDto,
		@Cookies('creation_token') creationToken: string,
		@ClearCookie() clearCookie: ClearCookieFunc,
		@SetCookie() setCookie: SetCookieFunc
	) {
		const verified = await this.jwtGeneratorService.decodeCreationToken(
			creationToken
		);
		const user = await this.userService.create(
			body.name,
			body.username,
			verified.email,
			{
				strategyName: verified.strategyName,
				details: verified.strategyDetails,
			}
		);

		if (verified.avatar) {
			const res = await fetch(verified.avatar);
			const avatar = await res.buffer();
			await this.userService.setAvatar(
				user.id,
				avatar,
				res.headers.get('content-type') as string
			);
		}

		setCookie(
			'access_token',
			await this.jwtGeneratorService.createAccessToken(user)
		);
		clearCookie('creation_token');
	}
}
