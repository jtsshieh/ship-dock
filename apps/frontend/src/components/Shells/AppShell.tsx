import React, { ReactElement, useContext, useEffect } from 'react';
import { Container, Theme, useMediaQuery } from '@material-ui/core';
import { Navbar } from '../Nav/Navbar';
import { LoadingContextProvider } from '../Loading/LoadingContext';
import { useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import {
	SubpageTabsContext,
	SubpageTabsContextProvider,
} from '../Nav/SubpageTabs/SubpageTabsContext';

export function AppShell({ children }: { children: ReactElement }) {
	const { user, isLoading, loggedIn } = useUser();
	const router = useRouter();
	useEffect(() => {
		if (!isLoading && !loggedIn) router.replace('/auth/login');
	}, [isLoading, loggedIn, router]);

	return (
		<SubpageTabsContextProvider>
			<LoadingContextProvider>
				<div
					css={(theme) => ({
						display: 'flex',
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
						minHeight: '100vh',
						flexDirection: 'column',
					})}
				>
					<Navbar />
					{user && <AppContainer>{children}</AppContainer>}
				</div>
			</LoadingContextProvider>
		</SubpageTabsContextProvider>
	);
}

function AppContainer({ children }: { children: ReactElement }) {
	const mobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
	const { subpageTabs } = useContext(SubpageTabsContext);

	return (
		<Container
			css={(theme) => ({
				overflow: 'hidden',
				paddingTop: theme.spacing(4),
				paddingBottom: theme.spacing(4),
				marginTop: theme.spacing(subpageTabs && mobile ? 16 : 8),
			})}
		>
			{children}
		</Container>
	);
}
