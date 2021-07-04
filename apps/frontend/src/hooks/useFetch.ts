import useSWR from 'swr';
import { api, FetchError } from '../util/api';

export const useFetch = <Data>(url: string | null, initialData?: Data) => {
	const { data, error, mutate } = useSWR<Data, FetchError>(url, api.get, {
		refreshInterval: 10000,
		initialData,
	});

	const isLoading = !data && !error;

	return { data, error, mutate, isLoading };
};
