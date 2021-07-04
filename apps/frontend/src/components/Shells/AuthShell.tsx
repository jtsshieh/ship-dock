import Head from 'next/head';
import { Paper, Theme, useMediaQuery } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { LoadingContextProvider } from '../Loading/LoadingContext';
import { ProgressBar } from '../Loading/ProgressBar';

export function AuthShell({ children }: { children: ReactElement }) {
	const mobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));

	return (
		<LoadingContextProvider>
			<div
				css={(theme) => ({
					height: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: theme.palette.background.default,
				})}
			>
				<Head>
					<title>Login</title>
				</Head>

				<Paper
					variant="outlined"
					square={mobile}
					css={(theme) => ({
						padding: theme.spacing(4),
						height: 600,
						width: 450,
						[theme.breakpoints.down('xs')]: {
							width: '100%',
							height: '100%',
						},
						position: 'relative',
					})}
				>
					<ProgressBar />
					{children}
				</Paper>
			</div>
		</LoadingContextProvider>
	);
}
