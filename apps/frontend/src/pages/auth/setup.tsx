import { Button, CircularProgress, Typography } from '@material-ui/core';
import { TextField } from '@ship-dock/rhf-material-ui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setup } from '../../actions/account';
import Head from 'next/head';
import { api } from '../../util/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormValues {
	name: string;
	email: string;
	password: string;
}

const yupSchema = yup.object().shape({
	name: yup.string().required('Enter your name'),
	email: yup
		.string()
		.email('Must be a valid email')
		.required('Enter your email'),
	password: yup.string().required('Enter your password'),
});

export default function Setup() {
	const [loading, setLoading] = useState(true);
	const { handleSubmit, control } = useForm<FormValues>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		resolver: yupResolver(yupSchema),
	});

	const router = useRouter();

	useEffect(() => {
		(async () => {
			const result = await api.get('auth/setup');
			if (result === true) await router.replace('/app');
			else setLoading(false);
		})();
	}, [router]);

	const onSubmit = async ({ name, email, password }: FormValues) => {
		await setup(name, email, password);
		await router.replace('/app');
	};

	return (
		<form
			css={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				gap: theme.spacing(2),
			})}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Head>
				<title>Setup</title>
			</Head>
			{loading ? (
				<CircularProgress />
			) : (
				<>
					<Typography variant="h4" align="center" gutterBottom>
						Welcome to ShipDock
					</Typography>
					<Typography
						variant="body1"
						color="textSecondary"
						align="center"
						gutterBottom
					>
						ShipDock is a web app allowing you to create, manage, and delete
						docker containers, images, and volumes from any device that has
						internet access.
					</Typography>
					<Typography variant="h6" align="center" gutterBottom>
						To complete setup, create the admin account now:
					</Typography>
					<TextField
						name="name"
						control={control}
						fullWidth
						label="Name"
						variant="outlined"
						autoFocus
					/>
					<TextField
						name="email"
						control={control}
						fullWidth
						label="Email"
						variant="outlined"
						autoFocus
					/>
					<TextField
						name="password"
						control={control}
						fullWidth
						label="Password"
						variant="outlined"
						type="password"
					/>
					<Button variant="contained" color="primary" type="submit">
						Create account
					</Button>
				</>
			)}
		</form>
	);
}
