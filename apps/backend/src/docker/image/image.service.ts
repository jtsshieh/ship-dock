import { Inject, Injectable } from '@nestjs/common';
import Dockerode from 'dockerode';
import streamToPromise from 'stream-to-promise';
import { DockerImage, DockerInspectedImage } from '@ship-dock/api-interface';

@Injectable()
export class ImageService {
	constructor(@Inject('DOCKER') private docker: Dockerode) {}

	async list(): Promise<DockerImage[]> {
		return (await this.docker.listImages()).reduce(
			(acc: DockerImage[], image) => {
				return acc.concat(
					image.RepoTags.map((tag) => ({
						id: image.Id,
						repository: tag.split(':')[0],
						tag: tag.split(':')[1],
						repoTag: tag,
						created: image.Created,
						size: image.Size,
					}))
				);
			},
			[]
		);
	}

	async inspect(id: string): Promise<DockerInspectedImage> {
		const image = await this.docker.getImage(id).inspect();
		return {
			id: image.Id,
			created: (image.Created as unknown) as number,
			size: image.Size,
			ports: image.Config.ExposedPorts
				? Object.keys(image.Config.ExposedPorts)
				: [],
			mounts: image.Config.Volumes ? Object.keys(image.Config.Volumes) : [],
		};
	}

	async remove(id: string): Promise<void> {
		await this.docker.getImage(id).remove();
	}

	async pull(name: string): Promise<void> {
		await streamToPromise(await this.docker.pull(name));
	}
}
