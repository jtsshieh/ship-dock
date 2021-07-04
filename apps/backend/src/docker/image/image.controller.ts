import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { DockerImage, DockerInspectedImage } from '@ship-dock/api-interface';

@Controller('api/images')
@UseGuards(JwtAuthGuard)
export class ImageController {
	constructor(private imageService: ImageService) {}

	@Get()
	@ApiOkResponse({ description: 'All of the images that exist' })
	list(): Promise<DockerImage[]> {
		return this.imageService.list();
	}

	@Get(':id/inspect')
	inspect(@Param('id') id: string): Promise<DockerInspectedImage> {
		return this.imageService.inspect(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<void> {
		return this.imageService.remove(id);
	}

	@Post('pull')
	pull(@Query('name') name: string): Promise<void> {
		return this.imageService.pull(name);
	}
}
