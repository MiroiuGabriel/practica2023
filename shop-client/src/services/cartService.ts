import { httpClient } from '../axios.config';

export type CartProduct = {
	id: number;
	name: string;
	description: string;
	image: string;
	price: number;
	quantity: number;
};

class CartService {
	constructor(public url: string, private provider: IProvider) {}

	public async add(productId: number) {
		return await this.provider.add(productId);
	}

	public async remove(productId: number) {
		return await this.provider.remove(productId);
	}

	public async get(signal?: AbortSignal) {
		return await this.provider.get(signal);
	}
}

export class LocalStorageProvider implements IProvider {
	public url: string = '/api/products';

	public async add(productId: number) {
		const cart: CartProduct[] = JSON.parse(
			localStorage.getItem('cart') || '[]'
		);

		const index = cart.findIndex(p => p.id === productId);

		const isInCart = index !== -1;

		if (isInCart) {
			cart[index].quantity += 1;

			localStorage.setItem('cart', JSON.stringify(cart));

			return cart[index];
		}

		const { data } = await httpClient.get<CartProduct>(
			`${this.url}/${productId}`
		);

		const product = { ...data, quantity: 1 };

		localStorage.setItem('cart', JSON.stringify([...cart, product]));

		return product;
	}

	public async remove(productId: number) {
		const cart: CartProduct[] = JSON.parse(
			localStorage.getItem('cart') || '[]'
		);

		const index = cart.findIndex(p => p.id === productId);

		const isInCart = index !== -1;

		if (isInCart && cart[index].quantity > 1) {
			cart[index].quantity -= 1;
			localStorage.setItem('cart', JSON.stringify(cart));

			return cart[index];
		}

		const filteredCart = cart.filter(product => product.id !== productId);

		localStorage.setItem('cart', JSON.stringify(filteredCart));

		return null;
	}

	public async get() {
		const cart: CartProduct[] = JSON.parse(
			localStorage.getItem('cart') || '[]'
		);

		return cart;
	}
}

export class ServerProvider implements IProvider {
	public url: string = '/api/cart';

	public async add(productId: number) {
		const { data } = await httpClient.post<CartProduct>(this.url, {
			productId,
		});

		return data;
	}

	public async remove(productId: number) {
		console.log(`${this.url}/${productId}`);
		const { data } = await httpClient.delete<CartProduct>(
			`${this.url}/${productId}`
		);

		return data;
	}

	public async get(signal?: AbortSignal) {
		const { data } = await httpClient.get<CartProduct[]>(this.url, {
			signal,
		});

		return data;
	}
}

export interface IProvider {
	url: string;
	add: (productId: number) => Promise<CartProduct>;
	remove: (productId: number) => Promise<CartProduct | null>;
	get: (signal?: AbortSignal) => Promise<CartProduct[]>;
}

export const getCartService = (provider: IProvider) =>
	new CartService('/api/cart', provider);
