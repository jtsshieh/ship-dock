import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { SubpageTabsContext } from '../components/Nav/SubpageTabs/SubpageTabsContext';

export const useContainerSubpages = () => {
	const { query } = useRouter();
	const { setSubpageTabs } = useContext(SubpageTabsContext);
	useEffect(() => {
		setSubpageTabs([
			{ text: 'Logs', path: { pathname: '/app/containers/[id]/logs', query } },
			{
				text: 'Inspect',
				path: { pathname: '/app/containers/[id]/inspect', query },
			},
		]);
		return () => setSubpageTabs(undefined);
	}, [query, setSubpageTabs]);
};
