import {
	Chip,
	Fab,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Paper,
	Snackbar,
	Tooltip,
	Typography,
} from '@material-ui/core';
import {
	Add,
	Close,
	Delete,
	PlayArrow,
	Replay,
	Stop,
} from '@material-ui/icons';
import Link from 'next/link';
import { mutate } from 'swr';
import { useContext, useState } from 'react';
import { LoadingContext } from '../../../components/Loading/LoadingContext';
import Head from 'next/head';
import { useProtectedFetch } from '../../../hooks/useProtectedFetch';
import { DockerContainer } from '@ship-dock/api-interface';
import { CreateContainerDialog } from '../../../components/Dialogs/CreateContainer';
import { ConfirmDialog } from '../../../components/Dialogs/ConfirmDialog';
import { InferGetServerSidePropsType } from 'next';
import { api } from '../../../util/api';
import { generateGetServerSideProps } from '../../../util/generateGetServerSideProps';

export default function Containers({
	containers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data } = useProtectedFetch<DockerContainer[]>(
		'containers',
		containers
	);
	const [createContainerDialog, setCreateContainerDialog] = useState(false);

	if (!data) return null;

	return (
		<div>
			<Head>
				<title>Docker Containers</title>
			</Head>
			<Typography
				variant="h3"
				align="center"
				gutterBottom
				css={{ marginTop: '0.35em' }}
			>
				Docker Containers
			</Typography>
			<List>
				{data.map((container) => (
					<ContainerTile key={container.id} container={container} />
				))}
			</List>
			<Tooltip title="Create container">
				<Fab
					color="primary"
					onClick={() => setCreateContainerDialog(true)}
					css={(theme) => ({
						position: 'absolute',
						bottom: theme.spacing(2),
						right: theme.spacing(2),
					})}
				>
					<Add />
				</Fab>
			</Tooltip>
			<CreateContainerDialog
				open={createContainerDialog}
				handleClose={() => setCreateContainerDialog(false)}
			/>
		</div>
	);
}

function ContainerTile({ container }: { container: DockerContainer }) {
	const running = container.state === 'running';
	const [notificationSnackbar, setNotificationSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const { setLoading } = useContext(LoadingContext);
	const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

	return (
		<>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={notificationSnackbar}
				autoHideDuration={6000}
				onClose={() => setNotificationSnackbar(false)}
				message={snackbarMessage}
				action={
					<IconButton
						size="small"
						color="inherit"
						onClick={() => setNotificationSnackbar(false)}
					>
						<Close />
					</IconButton>
				}
			/>
			<ConfirmDialog
				title="Remove container permanently?"
				content="This action is irreversible"
				action="Remove"
				callback={async () => {
					await api.delete(`containers/${container.id}`);
					await mutate('containers');
					setSnackbarMessage(`The container has been removed`);
					setNotificationSnackbar(true);
				}}
				open={confirmDeleteDialog}
				handleClose={() => setConfirmDeleteDialog(false)}
			/>
			<Link href={`/app/containers/${container.id}`}>
				<Paper
					variant="outlined"
					css={(theme) => ({
						backgroundColor: theme.palette.background.default,
						marginTop: theme.spacing(2),
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: theme.palette.action.hover,
						},
					})}
				>
					<ListItem
						key={container.id}
						css={(theme) => ({ padding: theme.spacing(2) })}
					>
						<ListItemText
							primary={
								<>
									{container.names.join(' ') + ' '}
									<Chip color="primary" size="small" label={container.image} />
								</>
							}
							secondary={
								<>
									{running ? (
										<status-indicator positive />
									) : (
										<status-indicator negative />
									)}{' '}
									{container.status}
								</>
							}
						/>
						<ListItemSecondaryAction>
							<Tooltip title={running ? 'Stop Container' : 'Start Container'}>
								<IconButton
									onClick={async (e) => {
										e.preventDefault();
										setLoading(true);
										await api.post(
											`containers/${container.id}/${running ? 'stop' : 'start'}`
										);
										await mutate('containers');
										setSnackbarMessage(
											`The container has been ${
												running ? 'stopped' : 'started'
											}`
										);
										setNotificationSnackbar(true);
										setLoading(false);
									}}
								>
									{running ? <Stop /> : <PlayArrow />}
								</IconButton>
							</Tooltip>
							<Tooltip title="Restart Container">
								<IconButton
									onClick={async (e) => {
										e.preventDefault();
										setLoading(true);
										await api.post(`containers/${container.id}/restart`);
										await mutate('containers');
										setSnackbarMessage(`The container has been restarted`);
										setNotificationSnackbar(true);
										setLoading(false);
									}}
								>
									<Replay />
								</IconButton>
							</Tooltip>
							<Tooltip title="Remove Container">
								<IconButton
									edge="end"
									onClick={(e) => {
										e.preventDefault();
										setConfirmDeleteDialog(true);
									}}
								>
									<Delete />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
				</Paper>
			</Link>
		</>
	);
}

export const getServerSideProps = generateGetServerSideProps<
	'containers',
	DockerContainer[]
>('containers');
