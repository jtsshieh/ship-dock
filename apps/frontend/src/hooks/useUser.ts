import { useFetch } from './useFetch';
import { UserProfile } from '@ship-dock/api-interface';

export const useUser = () => {
	const { data, error, isLoading, mutate } = useFetch<UserProfile>(
		'auth/profile'
	);

	const loggedIn = !error && data;

	return { loggedIn, user: data, isLoading, mutate } as
		| {
				loggedIn: true;
				user: UserProfile;
				isLoading: false;
				mutate: () => Promise<undefined>;
		  }
		| {
				loggedIn: false;
				user: undefined;
				isLoading: true;
				mutate: () => Promise<undefined>;
		  };
};
