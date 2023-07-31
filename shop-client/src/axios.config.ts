import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { tokenService } from './services/tokenService';
import { authService } from './services';
import toast from 'react-hot-toast';
import { router } from './router';

// TODO: Add with credentials for authorization
export const httpClient = axios.create({
	baseURL: 'https://localhost:7232',
	withCredentials: true,
});

httpClient.interceptors.request.use(
	config => {
		const token = tokenService.getLocalAccessToken();

		if (token) {
			config.headers['Authorization'] = `Bearer ${token.token}`;
		}

		return config;
	},
	error => Promise.reject(error)
);

httpClient.interceptors.response.use(
	res => {
		return res;
	},
	async err => {
		const error = err as AxiosError;
		const config = error.config!;

		const token = tokenService.getLocalAccessToken();

		if (error.response) {
			if (
				config?.url !== '/api/auth/sign-in' &&
				error.response.status === 401
			) {
				if (!token) return axios(config as AxiosRequestConfig);

				if (new Date(token.expires) < new Date(Date.now())) {
					const id = toast.loading('Please wait, authenticating...');

					try {
						await authService.refresh();

						toast.remove(id);
						toast.success('Authenticated successfully');

						const newToken = tokenService.getLocalAccessToken()!;

						config.headers[
							'Authorization'
						] = `Bearer ${newToken.token}`;

						return axios(config as AxiosRequestConfig);
					} catch (err) {
						toast.remove(id);
						authService.logout();
						toast.error(
							'Failed to authenticate! Please sign in again'
						);
						router.navigate('/auth/sign-in', { replace: true });
					}
				}
			}
		}

		return Promise.reject(err);
	}
);
