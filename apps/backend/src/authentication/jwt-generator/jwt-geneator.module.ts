import { Module } from '@nestjs/common';
import { JwtGeneratorService } from './jwt-generator.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
	providers: [JwtGeneratorService],
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get('TOKEN_SECRET'),
					signOptions: { expiresIn: '1d' },
				};
			},
			inject: [ConfigService],
		}),
	],
	exports: [JwtGeneratorService],
})
export class JwtGeneratorModule {}
