import { UserProfile } from '@ship-dock/api-interface';

export class UserProfileDto implements UserProfile {
	name!: string;
	email!: string;
	id!: string;
	username!: string;
}
