import { createContext, useEffect, useState, useContext } from 'react';
import { User } from '../services';
import { tokenService } from '../services/tokenService';

const AuthContext = createContext<User | null>(null);

type AuthProviderProps = {
	children: React.ReactNode;
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(() => tokenService.getUser());

	useEffect(() => {
		const userChanged = () => {
			const localUser = tokenService.getUser();

			setUser(localUser);
		};

		window.addEventListener('auth', userChanged);

		return () => window.removeEventListener('auth', userChanged);
	}, []);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
