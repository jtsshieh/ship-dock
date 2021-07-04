import { createContext, Dispatch, SetStateAction } from 'react';

interface ThemeSwitcherContextValue {
	darkTheme: boolean;
	setDarkTheme: Dispatch<SetStateAction<boolean>>;
}

export const ThemeSwitcherContext = createContext<ThemeSwitcherContextValue>(
	// @ts-expect-error null default value
	null
);
