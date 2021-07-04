import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContainerSubpages } from '../../../../hooks/useContainerSubpages';
import Head from 'next/head';

const LogPanel = dynamic(
	() => import('../../../../components/Terminal/LogPanel'),
	{
		ssr: false,
	}
);

export default function ContainerLogs() {
	const router = useRouter();
	const { id } = router.query;
	useContainerSubpages();

	return (
		<>
			<Head>
				<title>Container Logs</title>
			</Head>
			<LogPanel id={id as string} />
		</>
	);
}
