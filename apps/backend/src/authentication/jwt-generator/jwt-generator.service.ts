import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtPayloadInterface } from '../strategies/jwt/jwt-payload.interface';
import { CreationTokenPayload } from './creation-token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGeneratorService {
	constructor(private jwtService: JwtService) {}

	createAccessToken({ name, id, username, email, permissions }: User) {
		const payload: JwtPayloadInterface = {
			name,
			username,
			sub: id,
			email,
			permissions,
		};
		return this.jwtService.signAsync(payload);
	}

	createCreationToken(
		email: string,
		avatar: string | undefined,
		strategyName: string,
		strategyDetails: Prisma.JsonValue
	) {
		const payload: CreationTokenPayload = {
			email,
			avatar,
			strategyName,
			strategyDetails,
		};

		return this.jwtService.signAsync(payload, { expiresIn: '5 minutes' });
	}

	async decodeCreationToken(creationToken: string) {
		try {
			return await this.jwtService.verifyAsync<CreationTokenPayload>(
				creationToken
			);
		} catch {
			throw new BadRequestException('Issue with JWT verification');
		}
	}
}
