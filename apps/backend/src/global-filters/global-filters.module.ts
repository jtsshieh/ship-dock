import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { FrontendRedirectFilter } from './frontend-redirect.filter';

@Module({
	providers: [
		{
			provide: APP_FILTER,
			useClass: FrontendRedirectFilter,
		},
	],
})
export class GlobalFiltersModule {}
