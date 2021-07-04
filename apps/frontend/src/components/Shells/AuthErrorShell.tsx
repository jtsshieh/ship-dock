import { ReactNode } from 'react';
import { Button } from '@material-ui/core';
import Link from 'next/link';

export function AuthErrorShell({ children }: { children: ReactNode }) {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<div css={{ flex: 1 }}>{children}</div>
			<div
				css={{
					display: 'flex',
					flex: 1,
					alignItems: 'flex-end',
					justifyContent: 'center',
				}}
			>
				<Link href="/auth/login" passHref>
					<Button component="a" variant="contained" color="primary">
						Back to Login
					</Button>
				</Link>
			</div>
		</div>
	);
}
