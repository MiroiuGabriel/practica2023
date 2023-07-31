import { AxiosError } from 'axios';
import { httpClient } from '../axios.config';
import toast from 'react-hot-toast';
import { tokenService } from './tokenService';
import { router } from '../router';
import { CartProduct } from './cartService';

type SignIn = {
	email: string;
	password: string;
};

export type User = {
	email: string;
	username: string;
};

export type AccessToken = {
	token: string;
	expires: Date;
	issuedAt: Date;
};

type AuthResponse = {
	accessToken: AccessToken;
	refreshToken: string;
	user: User;
};

export type ProblemResponse = {
	detail: string;
};

type SignUp = {
	username: string;
} & SignIn;

type GrantType = 'refresh' | 'credentials';

class AuthService {
	constructor(public url: string) {}

	public async syncCart() {
		const cart: CartProduct[] = JSON.parse(
			localStorage.getItem('cart') || '[]'
		);

		console.log('x');

		await httpClient.post('/api/cart/sync', cart);

		// Clear local state
		localStorage.setItem('cart', '[]');

		toast.success('Cart synced successfully');
	}

	public getAxiosErrorMessage(err: unknown) {
		const error = err as AxiosError;
		const data = error.response?.data;

		console.error('error', err);

		if (typeof data === 'object') {
			return (data as ProblemResponse).detail;
		}
		return data as string;
	}

	public async signIn(
		grantType: GrantType = 'credentials',
		credentials: SignIn | { refreshToken: string }
	) {
		try {
			const { data } = await httpClient.post<AuthResponse>(
				`${this.url}/sign-in`,
				{
					...credentials,
					grantType: grantType,
				}
			);

			tokenService.setLocalAccessToken(data.accessToken);
			tokenService.setLocalRefreshToken(data.refreshToken);
			await this.syncCart();
			tokenService.setUser(data.user);
		} catch (err) {
			throw err;
		}
	}

	public async signUp(formData: SignUp) {
		try {
			const { data } = await httpClient.post<AuthResponse>(
				`${this.url}/sign-up`,
				formData
			);

			tokenService.setLocalAccessToken(data.accessToken);
			tokenService.setLocalRefreshToken(data.refreshToken);
			await this.syncCart();
			tokenService.setUser(data.user);
		} catch (err) {
			throw err;
		}
	}

	public async refresh() {
		const refreshToken = tokenService.getLocalRefreshToken();

		if (typeof refreshToken !== 'string') {
			console.log('cannot refresh');

			router.navigate('/auth/sign-in', {
				replace: true,
			});

			return;
		}

		return this.signIn('refresh', { refreshToken });
	}

	public logout() {
		tokenService.removeLocalAccessToken();
		tokenService.removeLocalRefreshToken();
		tokenService.removeUser();
		toast.success('Logged out sucessfully');
	}
}

export const authService = new AuthService('/api/auth');
