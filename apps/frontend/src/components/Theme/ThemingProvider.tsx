import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeSwitcherContext } from './ThemeSwitcherContext';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
	createMuiTheme,
	ThemeProvider as MuiThemeProvider,
	useMediaQuery,
} from '@material-ui/core';

export function ThemingProvider({ children }: { children: ReactNode }) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [darkTheme, setDarkTheme] = useState(prefersDarkMode);
	useEffect(() => {
		setDarkTheme(prefersDarkMode);
	}, [prefersDarkMode]);

	const theme = useMemo(
		() =>
			createMuiTheme({
				palette: {
					primary: {
						main: darkTheme ? '#2196f3' : '#2962ff',
						contrastText: '#fff',
					},
					type: darkTheme ? 'dark' : 'light',
				},
				shape: {
					borderRadius: 10,
				},
			}),
		[darkTheme]
	);

	return (
		<MuiThemeProvider theme={theme}>
			<EmotionThemeProvider theme={theme}>
				<ThemeSwitcherContext.Provider value={{ darkTheme, setDarkTheme }}>
					{children}
				</ThemeSwitcherContext.Provider>
			</EmotionThemeProvider>
		</MuiThemeProvider>
	);
}
