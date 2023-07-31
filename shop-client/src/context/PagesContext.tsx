import { createContext, useContext } from 'react';
import { pageService } from '../services';
import { useFetch } from '../hooks';
import { useAuth } from '.';

type Page = {
	route: string;
	name?: string;
};

export type Pages = {
	sidebarPages: Required<Page>[];
	other: Page[];
};

type PagesContextProps = {
	pages: Pages | undefined;
	loading: boolean;
};

const PagesContext = createContext<PagesContextProps>({
	loading: true,
	pages: undefined,
});

type PagesProviderProps = {
	children: React.ReactNode;
};

export const usePages = () => {
	return useContext(PagesContext);
};

export const PagesProvider: React.FC<PagesProviderProps> = ({ children }) => {
	const user = useAuth();

	const { loading, data } = useFetch<Pages>(
		async signal => await pageService.getPages(signal),
		[user]
	);

	return (
		<PagesContext.Provider
			value={{
				loading,
				pages: data,
			}}
		>
			{children}
		</PagesContext.Provider>
	);
};
