import { Mount } from './mount';

export interface DockerContainer {
	command: string;
	id: string;
	image: string;
	names: string[];
	state: string;
	status: string;
}

export interface DockerInspectedContainer {
	id: string;
	env: Record<string, string>;
	ports: Record<string, string>;
	mounts: Mount[];
}
