import toast from 'react-hot-toast';
import { httpClient } from '../axios.config';
import { PaginatedResponse } from '.';

export type CategoryFilter = {
	offset: number;
	limit: number;
	sort: number;
	search: string;
};

export type Category = {
	id: number;
	name: string;
	description: string;
};

class CategoryService {
	constructor(public url: string) {}

	private getQueryFromFilter(filter: Partial<CategoryFilter>) {
		const params = new URLSearchParams();

		Object.entries(filter).forEach(([key, value]) => {
			if (typeof value === 'string') params.append(key, value);
			else params.append(key, (value as any).toString());
		});

		return params.toString();
	}

	public async getCategories(
		filter: Partial<CategoryFilter>,
		signal?: AbortSignal
	) {
		const search = this.getQueryFromFilter(filter);
		const { data } = await httpClient.get<PaginatedResponse<Category>>(
			`${this.url}?${search}`,
			{ signal }
		);

		return data;
	}

	public async getCategoryById(id: number, signal?: AbortSignal) {
		const { data, status } = await httpClient.get<Category>(
			`${this.url}/${id}`,
			{
				signal,
			}
		);

		if (status == 404) {
			toast.error(`Category with id ${id} doesn't exist`);
			return;
		}

		return data;
	}

	public async deleteCategory(id: number) {
		try {
			await httpClient.delete(`${this.url}/${id}`);
		} catch (err) {
			toast.error(`Failed to delete category, it doesn't exist`);
			throw err;
		}
	}

	public async createCategory(category: Partial<Category>) {
		try {
			await httpClient.post(this.url, category);
			toast.success('Category created sucessfully');
		} catch (err) {
			toast.error(`Failed to create category`);
			throw err;
		}
	}

	public async updateCategory(fields: Partial<Category>) {
		try {
			await httpClient.put(this.url, fields);
			toast.success('Category updated sucessfully');
		} catch (err) {
			toast.error('Failed to update category');
			throw err;
		}
	}
}

export const categoryService = new CategoryService('/api/categories');
