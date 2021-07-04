import {
	createContext,
	Dispatch,
	ReactElement,
	SetStateAction,
	useState,
} from 'react';
import { SubpageTabs } from './SubpageTabs';

interface SubpageTabsContextValue {
	subpageTabs?: SubpageTabs;
	setSubpageTabs: Dispatch<SetStateAction<SubpageTabs | undefined>>;
}

export const SubpageTabsContext = createContext<SubpageTabsContextValue>(
	// @ts-expect-error null default value
	null
);

export function SubpageTabsContextProvider({
	children,
}: {
	children: ReactElement;
}) {
	const [subpageTabs, setSubpageTabs] = useState<SubpageTabs | undefined>(
		undefined
	);
	return (
		<SubpageTabsContext.Provider value={{ subpageTabs, setSubpageTabs }}>
			{children}
		</SubpageTabsContext.Provider>
	);
}
