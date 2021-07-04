import { useState } from 'react';
import {
	IconButton,
	Paper,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';
import copy from 'copy-to-clipboard';
import ContentCopy from '../../../../components/icons/ContentCopy';
import { Close } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useContainerSubpages } from '../../../../hooks/useContainerSubpages';
import Head from 'next/head';
import { useProtectedFetch } from '../../../../hooks/useProtectedFetch';
import {
	DockerInspectedContainer,
	VolumeMount,
} from '@ship-dock/api-interface';

export default function ContainerInspect() {
	const router = useRouter();
	const { id } = router.query;
	const { data } = useProtectedFetch<DockerInspectedContainer>(
		id ? `containers/${id}` : null
	);
	useContainerSubpages();

	if (!data) return null;

	const env = Object.entries(data.env);
	const ports = Object.entries(data.ports);
	const volumes = data.mounts
		.filter((mount): mount is VolumeMount => mount.type === 'volume')
		.map((mount): [string, string] => {
			return [mount.containerPath, mount.volumeName];
		});

	return (
		<>
			<Head>
				<title>Inspect Container</title>
			</Head>
			<InspectPanel
				title="Environment Variables"
				keyHeader="Key"
				valueHeader="Value"
				data={env}
				message="Environment variable copied"
			/>
			<InspectPanel
				title="Port Bindings"
				keyHeader="Container Port"
				valueHeader="Host Port"
				data={ports}
				message="Host port copied"
			/>
			<InspectPanel
				title="Volumes"
				keyHeader="Container Path"
				valueHeader="Volume name"
				data={volumes}
				message="Volume name path copied"
			/>
		</>
	);
}

function InspectPanel({
	title,
	keyHeader,
	valueHeader,
	data,
	message,
}: {
	title: string;
	keyHeader: string;
	valueHeader: string;
	data: [string, string][];
	message: string;
}) {
	const [open, setOpen] = useState(false);
	const closeSnackbar = () => setOpen(false);
	const openSnackbar = () => setOpen(true);
	if (data.length === 0) return null;
	return (
		<Paper
			css={(theme) => ({
				padding: theme.spacing(2),
				marginBottom: theme.spacing(4),
			})}
		>
			<Typography gutterBottom variant="h5">
				{title}
			</Typography>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell css={{ width: 'calc(100%/3)' }}>{keyHeader}</TableCell>
							<TableCell css={{ width: 'calc(100%/3*2)' }}>
								{valueHeader}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map(([key, value]) => (
							<TableRow key={key}>
								<TableCell
									css={{
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: '0.75rem',
									}}
								>
									{key}
								</TableCell>
								<TableCell
									css={{
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: '0.75rem',
									}}
								>
									{value}
								</TableCell>
								<TableCell>
									<IconButton
										onClick={() => {
											copy(value);
											openSnackbar();
										}}
									>
										<ContentCopy />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={open}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				message={message}
				action={
					<IconButton size="small" color="inherit" onClick={closeSnackbar}>
						<Close />
					</IconButton>
				}
			/>
		</Paper>
	);
}
