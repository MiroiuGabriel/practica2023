import { httpClient } from '../axios.config';
import { Pages } from '../context/PagesContext';

class PageService {
	constructor(public url: string) {}

	public async getPages(signal?: AbortSignal) {
		const { data } = await httpClient.get<Pages>(this.url, {
			signal,
		});

		return data;
	}
}

export const pageService = new PageService('/api/pages');
