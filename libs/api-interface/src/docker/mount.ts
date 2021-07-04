export type Mount = VolumeMount | BindMount | TmpFSMount;

export interface VolumeMount {
	type: 'volume';
	volumeName: string;
	containerPath: string;
}

export interface BindMount {
	type: 'bind';
	hostPath: string;
	containerPath: string;
}

export interface TmpFSMount {
	type: 'tmpfs';
	containerPath: string;
}
