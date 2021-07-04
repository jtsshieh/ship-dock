import { useFetchLoader } from './useFetchLoader';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useProtectedFetch = <Data>(
	url: string | null,
	initialData?: Data
) => {
	const { data, error } = useFetchLoader<Data>(url, initialData);
	const router = useRouter();

	useEffect(() => {
		if (error?.status === 401) router.replace('/auth/login');
	}, [error, router]);

	return { data, error };
};
