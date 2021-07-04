import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Theme,
	Typography,
} from '@material-ui/core';
import { Lock } from '@material-ui/icons';
import Discord from '../../components/icons/Discord';
import Link from 'next/link';
import { ComponentType, ExoticComponent } from 'react';
import { InferGetServerSidePropsType } from 'next';
import Google from '../../components/icons/Google';
import { api } from '../../util/api';

export default function Login({
	strategies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Typography variant="h5" align="center" gutterBottom>
				Choose a login method
			</Typography>
			<List css={{ margin: 'auto -32px' }}>
				{strategies.map((strategy) => (
					<StrategyTile key={strategy} strategy={strategy} />
				))}
			</List>
		</>
	);
}

function StrategyTile({ strategy }: { strategy: string }) {
	const Icon = strategyIconMap[strategy];
	return (
		<Link href={`/auth/strategy/${strategy}`} passHref>
			<ListItem
				button
				component="a"
				css={(theme) => ({
					height: theme.spacing(8),
				})}
			>
				<ListItemIcon>
					<Icon
						css={(theme: Theme) => ({
							width: theme.spacing(4),
							height: theme.spacing(4),
						})}
					/>
				</ListItemIcon>
				<ListItemText css={{ textTransform: 'capitalize' }}>
					{strategy}
				</ListItemText>
			</ListItem>
		</Link>
	);
}

const strategyIconMap: Record<
	string,
	| ComponentType<{ className?: string }>
	| ExoticComponent<{ className?: string }>
> = {
	local: Lock,
	discord: Discord,
	google: Google,
};

export const getServerSideProps = async () => {
	const strategies: string[] = await api.get('auth/strategies');
	return {
		props: { strategies },
	};
};
