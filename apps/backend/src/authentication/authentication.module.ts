import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { SettingsModule } from '../settings/settings.module';
import { StrategiesModule } from './strategies/strategies.module';
import { JwtGeneratorModule } from './jwt-generator/jwt-geneator.module';

@Module({
	controllers: [AuthenticationController],
	imports: [
		PassportModule,

		UsersModule,
		DatabaseModule,
		SettingsModule,

		StrategiesModule,
		JwtGeneratorModule,
	],
})
export class AuthenticationModule {}
