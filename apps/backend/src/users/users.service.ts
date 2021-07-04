import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
	constructor(private prisma: DatabaseService) {}

	get(where: Prisma.UserWhereUniqueInput) {
		return this.prisma.user.findUnique({
			where,
		});
	}

	async getAvatar(userId: string) {
		const avatar = await this.prisma.userAvatar.findUnique({
			where: { userId },
		});
		return avatar
			? {
					avatar: avatar.avatar,
					contentType: avatar.contentType,
			  }
			: undefined;
	}

	async setAvatar(userId: string, avatar: Buffer, contentType: string) {
		return await this.prisma.userAvatar.upsert({
			where: { userId },
			update: { avatar, contentType },
			create: { userId, avatar, contentType },
		});
	}

	async isUsernameAvailable(username: string) {
		return (await this.get({ username })) == null;
	}

	async getUserStrategies(where: Prisma.UserWhereUniqueInput) {
		return (
			await this.prisma.user.findUnique({
				where,
				include: {
					strategies: {
						include: {
							strategy: true,
						},
					},
				},
			})
		)?.strategies;
	}

	async getUserStrategy(username: string, strategyName: string) {
		const user = await this.prisma.user.findUnique({
			where: { username },
			include: {
				strategies: {
					where: {
						strategyName,
					},
				},
			},
		});

		return user && user.strategies.length > 0
			? {
					user,
					strategy: user.strategies[0],
			  }
			: null;
	}

	create(
		name: string,
		username: string,
		email: string,
		{
			strategyName,
			details,
		}: { strategyName: string; details: Prisma.InputJsonValue }
	) {
		return this.prisma.user.create({
			data: {
				name,
				username,
				email,
				strategies: {
					create: {
						strategyName,
						details,
					},
				},
			},
		});
	}
}
