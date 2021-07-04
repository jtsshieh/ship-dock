import { Module } from '@nestjs/common';
import { DockerModule } from './docker/docker.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalFiltersModule } from './global-filters/global-filters.module';
import { UsersModule } from './users/users.module';
import { NestNextModule } from '@nest-extensions/next';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		DockerModule,
		AuthenticationModule,
		GlobalFiltersModule,
		UsersModule,
		NestNextModule.register({ buildDir: 'dist/apps/frontend' }),
	],
})
export class AppModule {}
