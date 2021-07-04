import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Container() {
	const router = useRouter();
	const query = router.query;

	useEffect(() => {
		if (query.id)
			router.replace({ pathname: '/app/containers/[id]/logs', query });
	}, [query, router]);

	return null;
}
