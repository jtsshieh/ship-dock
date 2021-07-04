import { Fragment, ReactElement, useEffect, useState } from 'react';
import { useProtectedFetch } from '../../../hooks/useProtectedFetch';
import {
	DockerImage,
	DockerInspectedImage,
	VolumeMount,
} from '@ship-dock/api-interface';
import { css, useTheme } from '@emotion/react';
import {
	AppBar,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	FormControl,
	Grow,
	IconButton,
	InputLabel,
	MenuItem,
	TextField as MuiTextField,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { Select, TextField } from 'formik-material-ui';
import { mutate } from 'swr';
import { Add, Close, Delete, Dns, Image } from '@material-ui/icons';
import { ConfirmDialog } from '../ConfirmDialog';
import {
	createContainerDefaultData,
	CreateContainerFormData,
} from './FormData';
import {
	Autocomplete,
	AutocompleteRenderInputParams,
} from 'formik-material-ui-lab';
import { Field, FieldArray, Form, Formik, useFormikContext } from 'formik';
import { createContainer } from '../../../actions/container';
import * as yup from 'yup';

interface CreateContainerDialogProps {
	open: boolean;
	handleClose: () => void;
}

function CreateContainerForm({
	children,
	handleClose,
}: {
	children: ReactElement;
	handleClose: () => void;
}) {
	const handleSubmit = async (values: CreateContainerFormData) => {
		await createContainer(
			values.name,
			values.image,
			values.ports,
			values.mounts,
			values.env
		);
		await mutate('containers');
		handleClose();
	};

	return (
		<Formik
			initialValues={createContainerDefaultData}
			onSubmit={handleSubmit}
			validateOnMount={true}
			validationSchema={yup.object().shape({
				name: yup.string().required(''),
				image: yup.string().required(),
				ports: yup.array().of(
					yup.object().shape({
						hostPort: yup.string(),
						containerPort: yup.string().required(),
					})
				),
				mounts: yup.array().of(
					yup.object().shape({
						type: yup.string().required(),
						volumeName: yup.string(),
						containerPath: yup.string().required('Container path required'),
					})
				),
				env: yup.array().of(
					yup.object().shape({
						key: yup.string().required('Environment variable key required'),
						value: yup.string().required('Environment variable value required'),
					})
				),
			})}
		>
			{children}
		</Formik>
	);
}

function CreateContainerShell({
	open,
	handleClose,
}: CreateContainerDialogProps) {
	const {
		isSubmitting,
		resetForm,
		errors,
		dirty,
		validateForm,
	} = useFormikContext();
	const [discardDialog, setDiscardDialog] = useState(false);
	useEffect(() => {
		if (open) validateForm();
	}, [open]);

	const handleCustomClose = () => {
		if (dirty) setDiscardDialog(true);
		else {
			resetForm();
			handleClose();
		}
	};

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={Grow}
			disableBackdropClick={isSubmitting}
			disableEscapeKeyDown={isSubmitting}
		>
			<Form>
				<AppBar
					position="relative"
					css={(theme) => ({ backgroundColor: theme.palette.background.paper })}
					variant="outlined"
					color="inherit"
				>
					<Toolbar>
						<IconButton
							disabled={isSubmitting}
							edge="start"
							onClick={handleCustomClose}
						>
							<Close />
						</IconButton>
						<Typography
							variant="h6"
							css={(theme) => ({ marginLeft: theme.spacing(2), flex: 1 })}
						>
							Container
						</Typography>
						<Button
							disabled={isSubmitting || Object.keys(errors).length > 0}
							color="primary"
							type="submit"
							variant="contained"
						>
							{isSubmitting ? 'Creating...' : 'Create'}
						</Button>
					</Toolbar>
				</AppBar>
				<DialogContent
					css={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gridAutoRows: 'max-content',
					}}
				>
					<ContainerInfoPanel />
					<PortBindingsPanel />
					<VolumesPanel />
					<EnvPanel />
				</DialogContent>
			</Form>

			<ConfirmDialog
				title="Discard changes?"
				content="Your changes have not been saved"
				action="Discard"
				callback={() => {
					resetForm();
					handleClose();
				}}
				open={discardDialog}
				handleClose={() => setDiscardDialog(false)}
			/>
		</Dialog>
	);
}

export function CreateContainerDialog({
	open,
	handleClose,
}: CreateContainerDialogProps) {
	const { data: images } = useProtectedFetch<DockerImage[]>('images');

	if (!images) return null;

	return (
		<CreateContainerForm handleClose={handleClose}>
			<CreateContainerShell open={open} handleClose={handleClose} />
		</CreateContainerForm>
	);
}

function ContainerInfoPanel() {
	const theme = useTheme();
	const { data: images } = useProtectedFetch<DockerImage[]>('images');
	if (!images) return null;

	const fieldStyles = css({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing(4),
	});

	const borderStyle = `1px solid ${theme.palette.divider}`;
	return (
		<div
			css={{
				gridColumn: '1 / 3',
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(2),
				borderBottom: borderStyle,
				padding: `${theme.spacing(2)}px 0`,
			}}
		>
			<div css={fieldStyles}>
				<Dns />
				<Field
					component={TextField}
					error={false}
					helperText=""
					fullWidth
					autoFocus
					variant="outlined"
					label="Container name"
					name="name"
				/>
			</div>
			<div css={fieldStyles}>
				<Image />
				<FormControl fullWidth variant="outlined">
					<InputLabel>Image</InputLabel>
					<Field component={Select} label="Image" name="image">
						{images.map((image) => (
							<MenuItem value={image.repoTag} key={image.id}>
								{image.repoTag}
							</MenuItem>
						))}
					</Field>
				</FormControl>
			</div>
		</div>
	);
}

function PortBindingsPanel() {
	const { values, setValues } = useFormikContext<CreateContainerFormData>();
	const { image, ports } = values;
	const { data: inspectedImage } = useProtectedFetch<DockerInspectedImage>(
		image ? `images/${encodeURIComponent(image)}/inspect` : null
	);
	const theme = useTheme();
	useEffect(() => {
		if (!inspectedImage) return;
		setValues({
			...values,
			ports: inspectedImage.ports.map((port) => ({
				hostPort: '',
				containerPort: port,
			})),
		});
	}, [inspectedImage, setValues]);

	const borderStyle = `1px solid ${theme.palette.divider}`;

	return (
		<div
			css={{
				gridColumn: '1 / 3',
				borderBottom: borderStyle,
				[theme.breakpoints.up('sm')]: {
					gridColumn: '1 / 2',
					borderBottom: 'none',
					borderRight: borderStyle,
				},
				padding: theme.spacing(2),

				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gridAutoRows: 'max-content',
				gap: theme.spacing(1),
			}}
		>
			<Typography variant="h5" css={{ gridColumn: '1 / 3' }}>
				Port Bindings
			</Typography>
			{!image ? null : !inspectedImage ? (
				<CircularProgress />
			) : (
				<>
					<Typography css={{ gridColumn: '1 / 2' }} variant="h6">
						Host Port
					</Typography>
					<Typography css={{ gridColumn: '2 / 3' }} variant="h6">
						Container Port
					</Typography>
					{ports.map((port, index) => (
						<Fragment key={port.containerPort}>
							<Field
								component={TextField}
								fullWidth
								css={{ gridColumn: '1 / 2' }}
								variant="outlined"
								type="number"
								name={`ports.${index}.hostPort`}
							/>

							<Field
								component={TextField}
								fullWidth
								css={{ gridColumn: '2 / 3' }}
								variant="outlined"
								disabled={true}
								name={`ports.${index}.containerPort`}
							/>
						</Fragment>
					))}
				</>
			)}
		</div>
	);
}

function VolumesPanel() {
	const {
		values: { image, mounts },
		isSubmitting,
	} = useFormikContext<CreateContainerFormData>();
	const { data: inspectedImage } = useProtectedFetch<DockerInspectedImage>(
		image ? `images/${encodeURIComponent(image)}/inspect` : null
	);
	const theme = useTheme();
	const borderStyle = `1px solid ${theme.palette.divider}`;

	return (
		<div
			css={{
				gridColumn: '1 / 3',
				borderBottom: borderStyle,
				[theme.breakpoints.up('sm')]: {
					gridColumn: '2 / 3',
					borderBottom: 'none',
				},
				padding: theme.spacing(2),

				display: 'grid',
				gridTemplateColumns: '1fr 1fr 48px',
				gridAutoRows: 'max-content',
				gap: theme.spacing(1),
			}}
		>
			<Typography variant="h5" css={{ gridColumn: '1 / 3' }}>
				Volumes
			</Typography>
			{!image ? null : !inspectedImage ? (
				<CircularProgress />
			) : (
				<>
					<Typography css={{ gridColumn: '1 / 2' }} variant="h6">
						Volume Name
					</Typography>
					<Typography css={{ gridColumn: '2 / 3' }} variant="h6">
						Container Path
					</Typography>
					<FieldArray
						name="mounts"
						render={(arrayHelpers) => (
							<>
								{mounts
									.filter(
										(mount): mount is VolumeMount => mount.type === 'volume'
									)
									.map((mount, index) => (
										<Fragment key={index}>
											<Field
												component={TextField}
												fullWidth
												css={{ gridColumn: '1 / 2' }}
												variant="outlined"
												name={`mounts.${index}.hostPath`}
											/>

											<Field
												component={Autocomplete}
												freeSolo
												renderInput={(
													params: AutocompleteRenderInputParams
												) => (
													<MuiTextField
														{...params}
														fullWidth
														css={{ gridColumn: '2 / 3' }}
														variant="outlined"
														InputProps={{
															...params.InputProps,
															type: 'search',
														}}
													/>
												)}
												options={inspectedImage.mounts}
												name={`mounts.${index}.containerPath`}
											/>
											<IconButton
												css={{ gridColumn: '3 / 4', height: 48 }}
												disabled={isSubmitting}
												onClick={() => arrayHelpers.remove(index)}
											>
												<Delete />
											</IconButton>
										</Fragment>
									))}{' '}
								<IconButton
									css={{ gridColumn: '1 / 3', placeSelf: 'center' }}
									color="primary"
									disabled={isSubmitting}
									onClick={() =>
										arrayHelpers.push({
											type: 'volume',
											volumeName: '',
											containerPath: '',
										})
									}
								>
									<Add />
								</IconButton>{' '}
							</>
						)}
					/>
				</>
			)}
		</div>
	);
}

function EnvPanel() {
	const {
		values: { env },
		isSubmitting,
	} = useFormikContext<CreateContainerFormData>();
	const theme = useTheme();
	const borderStyle = `1px solid ${theme.palette.divider}`;

	return (
		<div
			css={{
				gridColumn: '1 / 3',
				[theme.breakpoints.up('sm')]: {
					gridColumn: '1 / 2',
					borderTop: borderStyle,
				},
				padding: theme.spacing(2),

				display: 'grid',
				gridTemplateColumns: '1fr 1fr 48px',
				gridAutoRows: 'max-content',
				gap: theme.spacing(1),
			}}
		>
			<Typography variant="h5" css={{ gridColumn: '1 / 3' }}>
				Environment Variables
			</Typography>

			<Typography css={{ gridColumn: '1 / 2' }} variant="h6">
				Key
			</Typography>
			<Typography css={{ gridColumn: '2 / 3' }} variant="h6">
				Value
			</Typography>
			<FieldArray
				name="env"
				render={(arrayHelpers) => (
					<>
						{env.map(({ key, value }, index) => (
							<Fragment key={index}>
								<Field
									component={TextField}
									fullWidth
									css={{ gridColumn: '1 / 2' }}
									variant="outlined"
									name={`env.${index}.key`}
								/>
								<Field
									component={TextField}
									fullWidth
									css={{ gridColumn: '2 / 3' }}
									variant="outlined"
									name={`env.${index}.value`}
								/>
								<IconButton
									css={{ gridColumn: '3 / 4', height: 48 }}
									disabled={isSubmitting}
									onClick={() => arrayHelpers.remove(index)}
								>
									<Delete />
								</IconButton>
							</Fragment>
						))}
						<IconButton
							css={{ gridColumn: '1 / 3', placeSelf: 'center' }}
							color="primary"
							disabled={isSubmitting}
							onClick={() => arrayHelpers.push({ key: '', value: '' })}
						>
							<Add />
						</IconButton>
					</>
				)}
			/>
		</div>
	);
}
