import useSWR from 'swr';
import { useContext } from 'react';
import { LoadingContext } from '../components/Loading/LoadingContext';
import { api, FetchError } from '../util/api';

export const useFetchLoader = <Data>(
	url: string | null,
	initialData?: Data
) => {
	const { setLoading } = useContext(LoadingContext);
	const { data, error } = useSWR<Data, FetchError>(
		url,
		async (url) => {
			setLoading(true);
			const result = await api.get(url);
			setLoading(false);
			return result;
		},
		{ refreshInterval: 10000, initialData }
	);

	return { data, error };
};
