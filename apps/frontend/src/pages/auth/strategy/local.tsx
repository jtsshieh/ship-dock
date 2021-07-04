import { Button, Typography, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useUser } from '../../../hooks/useUser';
import { loginLocal } from '../../../actions/account';
import { FetchError } from '../../../util/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@ship-dock/rhf-material-ui';

interface FormValues {
	username: string;
	password: string;
}

const yupSchema = yup.object().shape({
	username: yup.string().required('Enter your username'),
	password: yup.string().required('Enter your password'),
});

export default function LocalLogin() {
	const { handleSubmit, control, setError } = useForm<FormValues>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		resolver: yupResolver(yupSchema),
	});

	const router = useRouter();
	const theme = useTheme();
	const { mutate } = useUser();

	const onSubmit = async ({ username, password }: FormValues) => {
		try {
			await loginLocal(username, password);
		} catch (err) {
			if (err instanceof FetchError) {
				for (const [errorName, errorMessage] of Object.entries(
					err.error.validationErrors
				)) {
					setError(errorName as 'username' | 'password', {
						type: 'server',
						message: errorMessage as string,
					});
				}
				return;
			}
		}

		await mutate();
		await router.replace('/app');
	};

	return (
		<form
			css={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				height: '100%',
				gap: theme.spacing(2),
			}}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Typography align="center" variant="h4" gutterBottom>
				Local Log In
			</Typography>
			<TextField
				control={control}
				name="username"
				fullWidth
				autoFocus
				label="Username"
				variant="outlined"
			/>
			<TextField
				control={control}
				name="password"
				fullWidth
				label="Password"
				variant="outlined"
				type="password"
			/>
			<Button type="submit" variant="contained" color="primary">
				Log in
			</Button>
		</form>
	);
}
