import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Strategy, Profile } from 'passport-google-oauth';
import { StrategiesService } from '../strategies.service';
import { GoogleStrategyConfig } from './google-strategy-config.interface';
import { Request } from 'express';
import { FrontendRedirectException } from '../../../global-filters/frontend-redirect.exception';
import { ConfigService } from '@nestjs/config';
import { StrategySchema } from '../strategy.interface';
import { JwtGeneratorService } from '../../jwt-generator/jwt-generator.service';

const GOOGLE_STRATEGY_NAME = 'google';

export const GoogleStrategy: StrategySchema<GoogleStrategyConfig> = {
	name: GOOGLE_STRATEGY_NAME,
	init(config) {
		@Injectable()
		class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
			constructor(
				private userService: UsersService,
				private strategyService: StrategiesService,
				private jwtGeneratorService: JwtGeneratorService,
				private configService: ConfigService
			) {
				super({
					clientID: config.clientId,
					clientSecret: config.clientSecret,
					callbackURL: configService.get('BACKEND_URL') + '/api/auth/google',
					scope: ['email', 'profile'],
					passReqToCallback: true,
				});
			}

			async validate(
				req: Request,
				accessToken: string,
				refreshToken: string,
				googleProfile: Profile
			) {
				const email = googleProfile.emails?.[0]?.value;
				if (!email)
					throw new UnauthorizedException('There is no email on the profile.');
				if (!googleProfile.name)
					throw new UnauthorizedException('There is no name on the profile');
				const user = await this.userService.get({ email });
				if (!user) {
					if (
						await this.strategyService.canSelfRegister(GOOGLE_STRATEGY_NAME)
					) {
						req.res?.cookie(
							'creation_token',
							await this.jwtGeneratorService.createCreationToken(
								email,
								googleProfile.photos?.[0].value + '?sz=128',
								GOOGLE_STRATEGY_NAME,
								{}
							)
						);

						throw new FrontendRedirectException('/auth/create-account');
					} else
						throw new UnauthorizedException(
							`An account with email ${email} doesn't exist`
						);
				}
				if (
					(await this.userService.getUserStrategy(
						user.username,
						GOOGLE_STRATEGY_NAME
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

		return GoogleStrategy;
	},
};
