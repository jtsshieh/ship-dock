import React, {
	createContext,
	Dispatch,
	ReactElement,
	SetStateAction,
	useState,
} from 'react';

interface LoadingContextValue {
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

export const LoadingContext = createContext<LoadingContextValue>(
	// @ts-expect-error null default value
	null
);

export function LoadingContextProvider({
	children,
}: {
	children: ReactElement;
}) {
	const [loading, setLoading] = useState(false);
	return (
		<LoadingContext.Provider value={{ loading, setLoading }}>
			{children}
		</LoadingContext.Provider>
	);
}
