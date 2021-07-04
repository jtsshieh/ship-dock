import { IsNumberString, IsString } from 'class-validator';
import { PortData } from '@ship-dock/api-interface';

export class PortDataDto implements PortData {
	@IsNumberString()
	hostPort!: string;

	@IsString()
	containerPort!: string;
}
