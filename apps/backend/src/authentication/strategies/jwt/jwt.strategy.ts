import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService, private userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {
					if (req && req.cookies) return req.cookies['access_token'];
					else return null;
				},
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('TOKEN_SECRET'),
		});
	}

	validate({ sub }: JwtPayloadInterface) {
		return this.userService.get({ id: sub });
	}
}
