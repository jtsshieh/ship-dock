import { Typography } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { api, FetchError } from '../../../util/api';
import { Strategy } from '@ship-dock/api-interface';
import { AuthErrorShell } from '../../../components/Shells/AuthErrorShell';

interface StrategyNotFound {
	type: 'not found';
}

interface StrategyDisabled {
	type: 'disabled';
}

interface UnknownError {
	type: 'error';
}

type StrategyLoginProps = StrategyNotFound | StrategyDisabled | UnknownError;

export default function StrategyLogin({ type }: StrategyLoginProps) {
	if (type === 'not found')
		return (
			<AuthErrorShell>
				<Typography align="center" variant="h6">
					{type === 'not found'
						? 'The provided strategy was not found'
						: type === 'disabled'
						? 'The provided strategy is disabled'
						: 'An unknown error occurred'}
				</Typography>
			</AuthErrorShell>
		);

	return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	try {
		const strategy: Strategy = await api.get(
			`auth/strategies/${params?.strategy}`
		);
		if (!strategy.enabled)
			return {
				props: { type: 'disabled' },
			};

		return {
			redirect: {
				destination: `/api/auth/${strategy.name}`,
				permanent: false,
			},
		};
	} catch (error) {
		if (error instanceof FetchError && error.status === 404)
			return {
				props: { type: 'not found' },
			};
	}

	return { props: { type: 'error' } };
};
