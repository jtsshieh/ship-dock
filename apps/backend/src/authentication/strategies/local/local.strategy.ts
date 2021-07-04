import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { LocalStrategyDetails } from './local-strategy-details.interface';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGeneratorService } from '../../jwt-generator/jwt-generator.service';
import { StrategySchema } from '../strategy.interface';

export const LocalStrategy: StrategySchema = {
	name: 'local',
	init() {
		@Injectable()
		class LocalStrategy extends PassportStrategy(Strategy) {
			constructor(
				private userService: UsersService,
				private jwtGeneratorService: JwtGeneratorService
			) {
				super({ passReqToCallback: true });
			}

			async validate(req: Request, username: string, password: string) {
				const data = await this.userService.getUserStrategy(username, 'local');

				if (!data)
					throw new UnauthorizedException({
						validationErrors: {
							username: `An account with username ${username} doesn't exist`,
						},
					});

				const { user, strategy } = data;

				if (
					!(await bcrypt.compare(
						password,
						(strategy.details as unknown as LocalStrategyDetails).password
					))
				)
					throw new UnauthorizedException({
						validationErrors: {
							password: 'The provided password is incorrect',
						},
					});

				req.res?.cookie(
					'access_token',
					await this.jwtGeneratorService.createAccessToken(user)
				);
				return {};
			}
		}
		return LocalStrategy;
	},
};
