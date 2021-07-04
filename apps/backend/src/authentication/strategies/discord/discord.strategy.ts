import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { StrategiesService } from '../strategies.service';
import { DiscordStrategyConfig } from './discord-strategy-config.interface';
import { FrontendRedirectException } from '../../../global-filters/frontend-redirect.exception';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { StrategySchema } from '../strategy.interface';
import { JwtGeneratorService } from '../../jwt-generator/jwt-generator.service';

const DISCORD_STRATEGY_NAME = 'discord';

export const DiscordStrategy: StrategySchema<DiscordStrategyConfig> = {
	name: DISCORD_STRATEGY_NAME,
	init(config) {
		@Injectable()
		class DiscordStrategy extends PassportStrategy(Strategy) {
			constructor(
				private userService: UsersService,
				private strategiesService: StrategiesService,
				private jwtGeneratorService: JwtGeneratorService,
				private configService: ConfigService
			) {
				super({
					clientID: config.clientId,
					clientSecret: config.clientSecret,
					callbackURL: configService.get('BACKEND_URL') + '/api/auth/discord',
					scope: ['identify', 'email'],
					passReqToCallback: true,
				});
			}

			async validate(
				req: Request,
				accessToken: string,
				refreshToken: string,
				discordProfile: Profile
			) {
				if (!discordProfile.verified || !discordProfile.email)
					throw new UnauthorizedException(
						'There is no verified email on the profile.'
					);
				const user = await this.userService.get({
					email: discordProfile.email,
				});
				if (!user) {
					if (
						await this.strategiesService.canSelfRegister(DISCORD_STRATEGY_NAME)
					) {
						req.res?.cookie(
							'creation_token',
							await this.jwtGeneratorService.createCreationToken(
								discordProfile.email,
								`https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}`,
								DISCORD_STRATEGY_NAME,
								{
									id: discordProfile.id,
									discriminator: discordProfile.discriminator,
								}
							)
						);

						throw new FrontendRedirectException('/auth/create-account');
					} else
						throw new FrontendRedirectException(
							`/auth/error?type=no_email&email=${discordProfile.email}`
						);
				}
				if (
					(await this.userService.getUserStrategy(
						user.username,
						DISCORD_STRATEGY_NAME
					)) == null
				)
					throw new FrontendRedirectException('/auth/error?type=unlinked');

				req.res?.cookie(
					'access_token',
					await this.jwtGeneratorService.createAccessToken(user)
				);
				return {};
			}
		}
		return DiscordStrategy;
	},
};
