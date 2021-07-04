import { IsString, ValidateNested } from 'class-validator';
import { PortDataDto } from './port-data.dto';
import { EnvVariableDto } from './env-variable.dto';
import { Mount } from '@ship-dock/api-interface';

export class CreateContainerDto {
	@IsString()
	name!: string;

	@IsString()
	image!: string;

	@ValidateNested()
	ports!: PortDataDto[];

	mounts!: Mount[];

	@ValidateNested()
	env!: EnvVariableDto[];
}
