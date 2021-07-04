import { Controller, Get, Param } from '@nestjs/common';
import { StrategiesService } from './strategies.service';

@Controller('api/auth/strategies')
export class StrategiesController {
	constructor(private strategiesService: StrategiesService) {}

	@Get('')
	getStrategies() {
		return this.strategiesService.getEnabled();
	}

	@Get(':strategy')
	getStrategy(@Param('strategy') strategy: string) {
		return this.strategiesService.get(strategy);
	}
}
