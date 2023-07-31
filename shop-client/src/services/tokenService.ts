import { AccessToken, User } from './authService';

class TokenService {
	public getLocalRefreshToken() {
		const refreshToken: string | null = JSON.parse(
			localStorage.getItem('refreshToken') || 'null'
		);

		return refreshToken;
	}

	public getLocalAccessToken() {
		const accessToken: AccessToken | null = JSON.parse(
			localStorage.getItem('accessToken') || 'null'
		);

		return accessToken;
	}

	public setLocalAccessToken(accessToken: AccessToken) {
		localStorage.setItem('accessToken', JSON.stringify(accessToken));
	}

	public setLocalRefreshToken(refreshToken: string) {
		localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
	}

	public removeLocalAccessToken() {
		localStorage.removeItem('accessToken');
	}

	public removeLocalRefreshToken() {
		localStorage.removeItem('refreshToken');
	}

	public getUser() {
		const user: User | null = JSON.parse(
			localStorage.getItem('user') || 'null'
		);

		return user;
	}

	public removeUser() {
		localStorage.removeItem('user');
		window.dispatchEvent(new Event('auth'));
	}

	public setUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
		window.dispatchEvent(new Event('auth'));
	}
}

export const tokenService = new TokenService();
