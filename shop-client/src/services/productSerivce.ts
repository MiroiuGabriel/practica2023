import toast from 'react-hot-toast';
import { httpClient } from '../axios.config';
import { PaginatedResponse } from './types';

export type Order = 'asc' | 'desc';

export type Filter = {
	offset?: number;
	limit?: number;
	sort?: Order;
	budget?: number;
	categoryId?: number;
	search?: string;
	currentPage?: number;
};

export type Product = {
	id: number;
	name: string;
	description: string;
	image: string;
	price: number;
	categoryId: number;
};

class ProductService {
	constructor(public url: string) {}

	private getQueryFromFilter(filter: Filter) {
		const params = new URLSearchParams();

		Object.entries(filter).forEach(([key, value]) => {
			if (typeof value === 'string') params.append(key, value);
			else params.append(key, (value as any).toString());
		});

		return params.toString();
	}

	public async getProducts(filter: Filter, signal?: AbortSignal) {
		const search = this.getQueryFromFilter(filter);
		const { data } = await httpClient.get<PaginatedResponse<Product>>(
			`${this.url}?${search}`,
			{
				signal,
			}
		);

		return data;
	}

	public async deleteProduct(id: number) {
		try {
			await httpClient.delete(`${this.url}/${id}`);
		} catch (err) {
			toast.error(`Failed to delete product, it doesn't exist`);
		}
	}

	public async createProduct(product: Partial<Product>) {
		try {
			await httpClient.post(this.url, product);
			toast.success('Product created sucessfully');
		} catch (err) {
			toast.error(`Failed to create product`);
		}
	}

	public async updateProduct(fields: Partial<Product>) {
		try {
			await httpClient.put(this.url, fields);
			toast.success('Product updated sucessfully');
		} catch (err) {
			toast.error('Failed to update product');
		}
	}

	public async getProductById(id: number, signal?: AbortSignal) {
		const { data } = await httpClient.get<Product>(`${this.url}/${id}`, {
			signal,
		});

		return data;
	}
}

export const productService = new ProductService('/api/products');
