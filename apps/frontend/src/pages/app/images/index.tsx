import { mutate } from 'swr';
import {
	DataGrid,
	GridColDef,
	GridToolbarContainer,
} from '@material-ui/data-grid';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	Grow,
	LinearProgress,
	TextField,
	Tooltip,
	Typography,
} from '@material-ui/core';
import Head from 'next/head';
import { createContext, useContext, useState } from 'react';
import { Add, Delete, Search } from '@material-ui/icons';
import { ConfirmDialog } from '../../../components/Dialogs/ConfirmDialog';
import dayjs from 'dayjs';
import filesize from 'filesize.js';
import { red } from '@material-ui/core/colors';
import { useProtectedFetch } from '../../../hooks/useProtectedFetch';
import { DockerImage } from '@ship-dock/api-interface';
import { api } from '../../../util/api';
import { InferGetServerSidePropsType } from 'next';
import { generateGetServerSideProps } from '../../../util/generateGetServerSideProps';

const SelectedContext = createContext<DockerImage | undefined>(undefined);

export default function Images({
	images,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data } = useProtectedFetch<DockerImage[]>('images', images);
	const [selected, setSelected] = useState<DockerImage | undefined>(undefined);
	const [pullImageDialog, setPullImageDialog] = useState(false);

	const columns: GridColDef[] = [
		{ field: 'repository', headerName: 'Repository', flex: 1 },
		{ field: 'tag', headerName: 'Tag', flex: 1 },
		{ field: 'id', headerName: 'Image ID', flex: 3 },
		{
			field: 'created',
			headerName: 'Created',
			flex: 1,
			valueFormatter: (params) =>
				dayjs
					.duration(dayjs.unix(params.value as number).diff(dayjs()))
					.humanize(true),
			sortComparator: (v1, v2) => (v2 as number) - (v1 as number),
		},
		{
			field: 'size',
			headerName: 'Size',
			flex: 1,
			valueFormatter: (params) => filesize(params.value as number, 2, 'si'),
		},
	];
	if (!data) return null;

	return (
		<div>
			<Head>
				<title>Docker Images</title>
			</Head>
			<Typography
				variant="h3"
				align="center"
				gutterBottom
				css={{ marginTop: '0.35em' }}
			>
				Docker Images
			</Typography>
			<div
				css={{
					height: 500,
					width: '100%',
				}}
			>
				<SelectedContext.Provider value={selected}>
					<DataGrid
						disableColumnMenu
						components={{
							Toolbar: CustomToolbar,
						}}
						rows={data}
						columns={columns}
						onRowSelected={async (params) =>
							setSelected(
								params.isSelected ? (params.data as DockerImage) : undefined
							)
						}
					/>
				</SelectedContext.Provider>
			</div>
			<Tooltip title="Pull Image">
				<Fab
					color="primary"
					onClick={() => setPullImageDialog(true)}
					css={(theme) => ({
						position: 'absolute',
						bottom: theme.spacing(2),
						right: theme.spacing(2),
					})}
				>
					<Add />
				</Fab>
			</Tooltip>
			<PullImageDialog
				open={pullImageDialog}
				handleClose={() => setPullImageDialog(false)}
			/>
		</div>
	);
}

function CustomToolbar() {
	const selected = useContext(SelectedContext);
	const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

	return (
		<GridToolbarContainer>
			<Button
				size="small"
				startIcon={<Delete />}
				onClick={() => setConfirmDeleteDialog(true)}
				disabled={!selected}
				css={{ color: red[500] }}
			>
				Remove
			</Button>
			<Button size="small" startIcon={<Search />} disabled={!selected}>
				Inspect
			</Button>
			<ConfirmDialog
				title="Remove image permanently?"
				content="This action is irreversible"
				action="Remove"
				callback={async () => {
					await api.delete(`images/${selected?.id}`);
					await mutate('images');
				}}
				open={confirmDeleteDialog}
				handleClose={() => setConfirmDeleteDialog(false)}
			/>
		</GridToolbarContainer>
	);
}

function PullImageDialog({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) {
	const [name, setName] = useState('');
	const [pulling, setPulling] = useState(false);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			TransitionComponent={Grow}
			disableBackdropClick={pulling}
			disableEscapeKeyDown={pulling}
		>
			<form
				onSubmit={async (event) => {
					event.preventDefault();
					setPulling(true);

					const query = new URLSearchParams();
					query.set('name', name);
					await api.post(`images/pull?${query.toString()}`);
					await mutate('images');
					setPulling(false);
					handleClose();
				}}
			>
				{pulling && <LinearProgress />}
				<DialogTitle>Pull Docker Image</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Enter the image you want to pull.
					</DialogContentText>
					<TextField
						autoFocus
						variant="outlined"
						label="Image name"
						fullWidth
						disabled={pulling}
						onChange={(event) => setName(event.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={pulling}>
						Cancel
					</Button>

					<Button
						disabled={pulling || name.length === 0}
						color="primary"
						type="submit"
					>
						{pulling ? 'Pulling...' : 'Pull'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export const getServerSideProps = generateGetServerSideProps<
	'images',
	DockerImage[]
>('images');
