import { useUser } from '../hooks/useUser';
import { Button, Grow, Paper, Typography } from '@material-ui/core';
import React, { forwardRef, useEffect, useState } from 'react';
import { AccountCircle, ExitToApp, Settings } from '@material-ui/icons';
import { logout } from '../actions/account';
import Image from 'next/image';
import { api } from '../util/api';

const AccountCard = forwardRef<
	HTMLDivElement,
	{ open: boolean; className?: string }
>(function ({ open, className }, ref) {
	const data = useUser();
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (data?.user?.id)
			setAvatarUrl(api.url(`users/${data?.user?.id}/avatar`, true));
	}, [data?.user?.id]);

	if (!data.loggedIn) return null;
	if (data.isLoading) return null;

	return (
		<Grow in={open} mountOnEnter unmountOnExit>
			<Paper
				css={(theme) => ({
					transformOrigin: 'top right',
					position: 'fixed',
					top: 64 + theme.spacing(2),
					right: theme.spacing(2),
					padding: theme.spacing(2),
					width: 300,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: theme.spacing(2),
				})}
				elevation={2}
				ref={ref}
				className={className}
			>
				{avatarUrl ? (
					<Image
						src={avatarUrl}
						width={96}
						height={96}
						css={{ borderRadius: '50%' }}
						onError={() => setAvatarUrl(undefined)}
					/>
				) : (
					<AccountCircle css={{ height: 96, width: 96 }} />
				)}
				<div>
					<Typography variant="body1" align="center">
						{data.user.name}
					</Typography>
					<Typography variant="body1" align="center">
						{data.user.email}
					</Typography>
				</div>
				<Button variant="outlined" startIcon={<Settings />}>
					Manage Account
				</Button>
				<Button
					variant="outlined"
					startIcon={<ExitToApp />}
					onClick={() => logout()}
				>
					Log out
				</Button>
			</Paper>
		</Grow>
	);
});

export default AccountCard;
