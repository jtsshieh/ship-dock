export interface DockerImage {
	repository: string;
	tag: string;
	id: string;
	repoTag: string;
	created: number;
	size: number;
}

export interface DockerInspectedImage {
	id: string;
	created: number;
	size: number;
	ports: string[];
	mounts: string[];
}
