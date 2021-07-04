import { Inject, Injectable } from '@nestjs/common';
import Dockerode from 'dockerode';
import dotenv from 'dotenv';
import {
	DockerContainer,
	DockerInspectedContainer,
	EnvVariable,
	Mount,
	PortData,
} from '@ship-dock/api-interface';

@Injectable()
export class ContainerService {
	constructor(@Inject('DOCKER') private docker: Dockerode) {}

	async list(): Promise<DockerContainer[]> {
		return (await this.docker.listContainers({ all: true })).map(
			(container) => ({
				command: container.Command,
				id: container.Id,
				image: container.Image,
				names: container.Names,
				state: container.State,
				status: container.Status,
			})
		);
	}

	async getLogs(id: string) {
		return await this.docker
			.getContainer(id)
			.logs({ follow: true, stdout: true });
	}

	async get(id: string): Promise<DockerInspectedContainer> {
		const container = await this.docker.getContainer(id).inspect();
		const envVariables = Object.assign(
			{},
			...container.Config.Env.map((envVar) => dotenv.parse(envVar))
		);
		const ports = Object.assign(
			{},
			...Object.entries(container.HostConfig.PortBindings).map(
				([port, host]) => ({
					[port]: `${
						(host as { HostIp: string; HostPort: string }[])[0].HostIp
					}:${(host as { HostIp: string; HostPort: string }[])[0].HostPort}`,
				})
			)
		);
		const mounts = container.HostConfig.Mounts
			? container.HostConfig.Mounts.map((mount): Mount => {
					if (mount.Type === 'volume') {
						return {
							type: 'volume',
							volumeName: mount.Source,
							containerPath: mount.Target,
						};
					} else if (mount.Type === 'bind') {
						return {
							type: 'bind',
							hostPath: mount.Source,
							containerPath: mount.Target,
						};
					} else {
						return {
							type: 'tmpfs',
							containerPath: mount.Target,
						};
					}
			  })
			: [];

		return {
			id: container.Id,
			env: envVariables,
			ports,
			mounts,
		};
	}

	async remove(id: string): Promise<void> {
		await this.docker.getContainer(id).remove();
	}

	async start(id: string): Promise<void> {
		await this.docker.getContainer(id).start();
	}

	async stop(id: string): Promise<void> {
		await this.docker.getContainer(id).stop();
	}

	async restart(id: string): Promise<void> {
		await this.docker.getContainer(id).restart();
	}

	async create(
		name: string,
		image: string,
		ports: PortData[],
		mounts: Mount[],
		env: EnvVariable[]
	) {
		const options: Dockerode.ContainerCreateOptions = { name, Image: image };

		if (env.length > 0)
			options.Env = env.map(({ key, value }) => `${key}=${value}`);
		if (ports.length > 0) {
			if (!options.HostConfig) options.HostConfig = {};
			options.HostConfig.PortBindings = Object.assign(
				{},
				...ports.map((port) => ({
					[port.containerPort]: [{ HostPort: port.hostPort }],
				}))
			);
		}
		if (mounts.length > 0) {
			if (!options.HostConfig) options.HostConfig = {};
			options.HostConfig.Mounts = mounts.map((mount) => ({
				Target: mount.containerPath,
				Source:
					mount.type === 'volume'
						? mount.volumeName
						: mount.type === 'bind'
						? mount.hostPath
						: '',
				Type: mount.type,
			}));
		}
		console.log(options);
		await this.docker.createContainer(options);
	}
}
