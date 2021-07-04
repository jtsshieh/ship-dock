import { Type } from '@nestjs/common';

export type StrategyFn<T> = (config: T) => Type;

export interface StrategySchema<T = never> {
	init: StrategyFn<T>;
	name: string;
}
