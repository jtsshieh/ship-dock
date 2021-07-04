import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Sse,
	UseGuards,
} from '@nestjs/common';
import { ContainerService } from './container.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CreateContainerDto } from './dto/create-container.dto';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	DockerContainer,
	DockerInspectedContainer,
} from '@ship-dock/api-interface';

@Controller('api/containers')
@UseGuards(JwtAuthGuard)
export class ContainerController {
	constructor(private containerService: ContainerService) {}

	@Get()
	list(): Promise<DockerContainer[]> {
		return this.containerService.list();
	}

	@Get(':id')
	get(@Param('id') id: string): Promise<DockerInspectedContainer> {
		return this.containerService.get(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<void> {
		return this.containerService.remove(id);
	}

	@Sse(':id/logs')
	async streamLogs(@Param('id') id: string): Promise<Observable<string>> {
		const logStream = await this.containerService.getLogs(id);
		return from(logStream).pipe(map((val) => val.toString()));
	}

	@Post(':id/start')
	async start(@Param('id') id: string): Promise<void> {
		return this.containerService.start(id);
	}

	@Post(':id/stop')
	async stop(@Param('id') id: string): Promise<void> {
		return this.containerService.stop(id);
	}

	@Post(':id/restart')
	async restart(@Param('id') id: string): Promise<void> {
		return this.containerService.restart(id);
	}

	@Post('create')
	async create(
		@Body() { name, image, ports, mounts, env }: CreateContainerDto
	) {
		return this.containerService.create(name, image, ports, mounts, env);
	}
}
