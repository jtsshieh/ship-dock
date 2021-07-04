import { EnvVariable, Mount, PortData } from '@ship-dock/api-interface';

export interface CreateContainerFormData {
	name: string;
	image: string;
	ports: PortData[];
	mounts: Mount[];
	env: EnvVariable[];
}

export const createContainerDefaultData: CreateContainerFormData = {
	name: '',
	image: '',
	ports: [],
	mounts: [],
	env: [],
};
