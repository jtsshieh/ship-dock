import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemingProvider } from '../components/Theme/ThemingProvider';
import { AppShell } from '../components/Shells/AppShell';
import { CssBaseline, StylesProvider } from '@material-ui/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'status-indicator/styles.css';
import 'xterm/css/xterm.css';
import { AuthShell } from '../components/Shells/AuthShell';
import { api } from '../util/api';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function CustomApp({ router, Component, pageProps }: AppProps) {
	useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement?.removeChild(jssStyles);
		}
	}, []);

	useEffect(() => {
		if (router.pathname === '/auth/setup') return;

		(async () => {
			const result = await api.get('auth/setup');
			if (result === false) await router.replace('/auth/setup');
		})();
	}, [router]);
	return (
		<>
			<Head>
				<title>Ship Dock</title>
			</Head>
			<CssBaseline />
			<StylesProvider injectFirst>
				<ThemingProvider>
					{router.pathname.startsWith('/app') ? (
						<AppShell>
							<Component {...pageProps} />
						</AppShell>
					) : router.pathname.startsWith('/auth') ? (
						<AuthShell>
							<Component {...pageProps} />
						</AuthShell>
					) : (
						<Component {...pageProps} />
					)}
				</ThemingProvider>
			</StylesProvider>
		</>
	);
}
