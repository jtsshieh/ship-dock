import { Module } from '@nestjs/common';
import { ContainerController } from './container/container.controller';
import { ContainerService } from './container/container.service';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import Dockerode from 'dockerode';

@Module({
	imports: [],
	controllers: [ContainerController, ImageController],
	providers: [
		ContainerService,
		ImageService,
		{ provide: 'DOCKER', useClass: Dockerode },
	],
})
export class DockerModule {}
