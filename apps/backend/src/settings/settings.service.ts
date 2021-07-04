import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SETUP_KEY } from './settings-keys.constants';

@Injectable()
export class SettingsService {
	constructor(private prisma: DatabaseService) {}

	private async get(key: string) {
		return (await this.prisma.setting.findUnique({ where: { key } }))?.value;
	}

	private async set(key: string, value: string) {
		return this.prisma.setting.upsert({
			where: { key },
			create: { key, value },
			update: { value },
		});
	}

	async isSetup() {
		return (await this.get(SETUP_KEY)) === 't';
	}

	async setSetup() {
		await this.set(SETUP_KEY, 't');
	}
}
