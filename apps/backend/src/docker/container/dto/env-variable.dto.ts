import { EnvVariable } from '@ship-dock/api-interface';
import { IsString } from 'class-validator';

export class EnvVariableDto implements EnvVariable {
	@IsString()
	key!: string;

	@IsString()
	value!: string;
}
