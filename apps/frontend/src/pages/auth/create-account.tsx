import { GetServerSideProps } from 'next';
import { api, FetchError } from '../../util/api';
import { CreationToken } from '@ship-dock/api-interface';
import { TextField } from '@ship-dock/rhf-material-ui';
import { useForm } from 'react-hook-form';
import { Button, Typography } from '@material-ui/core';
import { createAccount } from '../../actions/account';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { AuthErrorShell } from '../../components/Shells/AuthErrorShell';

type Error = UnknownError | InvalidError;

interface UnknownError {
	status: 'error';
	type: 'unknown';
}

interface InvalidError {
	status: 'error';
	type: 'invalid';
}

interface Success {
	status: 'success';
	decoded: CreationToken;
}

type CreateAccountProps = Error | Success;

interface FormValues {
	name: string;
	username: string;
}

const yupSchema = yup.object().shape({
	name: yup.string().required('Enter your name'),
	username: yup
		.string()
		.required('Enter a username')
		.test('username', 'Username is not available', async (value) => {
			return (
				(await api.get(`auth/username-available?username=${value}`)) === true
			);
		}),
});

export default function CreateAccount(props: CreateAccountProps) {
	const { handleSubmit, control } = useForm<FormValues>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		resolver: yupResolver(yupSchema),
	});
	const router = useRouter();

	const onSubmit = async ({ name, username }: FormValues) => {
		await createAccount(name, username);
		await router.replace('/app');
	};

	if (props.status === 'error')
		return (
			<AuthErrorShell>
				<Typography align="center" variant="h6">
					{props.type === 'invalid'
						? 'Your creation token in invalid. Login to get a new one.'
						: 'An unknown error occurred'}
				</Typography>
			</AuthErrorShell>
		);

	return (
		<form
			css={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				height: '100%',
				gap: theme.spacing(2),
			})}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Typography align="center" variant="h4" gutterBottom>
				Create account
			</Typography>
			<Typography variant="body1" gutterBottom>
				Email: {props.decoded.email}
				<br />
				Strategy: {props.decoded.strategyName}
			</Typography>
			<TextField
				control={control}
				name="name"
				autoFocus
				label="Name"
				variant="outlined"
				fullWidth
			/>
			<TextField
				control={control}
				name="username"
				autoFocus
				label="Username"
				variant="outlined"
				fullWidth
			/>

			<Button variant="contained" color="primary" type="submit">
				Create Account
			</Button>
		</form>
	);
}

export const getServerSideProps: GetServerSideProps<CreateAccountProps> = async ({
	req,
}) => {
	try {
		const decoded: CreationToken = await api.get('auth/creation-token', {
			cookies: req.headers.cookie,
		});
		return {
			props: {
				status: 'success',
				decoded,
			},
		};
	} catch (err) {
		if (err instanceof FetchError && err.status === 400) {
			return { props: { status: 'error', type: 'invalid' } };
		} else {
			return { props: { status: 'error', type: 'unknown' } };
		}
	}
};
