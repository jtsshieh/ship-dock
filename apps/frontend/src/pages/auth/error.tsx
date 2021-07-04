import { useRouter } from 'next/router';
import { CircularProgress, Typography } from '@material-ui/core';
import { AuthErrorShell } from '../../components/Shells/AuthErrorShell';

export default function Error() {
	const router = useRouter();

	const type = router.query.type;

	if (type === 'unlinked') {
		return (
			<AuthErrorShell>
				<Typography align="center" variant="h6">
					The email on your profile matches an account that already exists.
					<br />
					<br />
					To link that account to this strategy, login to that account and add
					it in the account management page.
				</Typography>
			</AuthErrorShell>
		);
	}

	return <CircularProgress />;
}
