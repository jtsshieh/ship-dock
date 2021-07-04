import { EnvVariable, Mount, PortData } from '@ship-dock/api-interface';
import { api } from '../util/api';

export async function createContainer(
	name: string,
	image: string,
	ports: PortData[],
	mounts: Mount[],
	env: EnvVariable[]
) {
	await api.post('containers/create', {
		name,
		image,
		ports,
		mounts,
		env,
	});
}
