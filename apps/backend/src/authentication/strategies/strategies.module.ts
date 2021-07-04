import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UsersModule } from '../../users/users.module';
import { JwtGeneratorModule } from '../jwt-generator/jwt-geneator.module';

@Module({
	controllers: [StrategiesController],
	imports: [DatabaseModule, UsersModule, JwtGeneratorModule],
	providers: [StrategiesService, JwtStrategy],
	exports: [StrategiesService],
})
export class StrategiesModule {}
