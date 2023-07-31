import { CanceledError } from 'axios';
import { useEffect, useState } from 'react';

export const useFetch = <T>(
	fetcher: (signal: AbortSignal) => Promise<T>,
	rerun?: any[],
	onSuccess?: (data: T) => void,
	onError?: (err: unknown) => void
): {
	data?: T;
	loading: boolean;
} => {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState(true);

	const deps = rerun ? [...rerun] : [];

	useEffect(() => {
		const controller = new AbortController();

		fetcher(controller.signal)
			.then(d => {
				setData(d);
				setLoading(false);
				if (onSuccess) onSuccess(d);
			})
			.catch(err =>
				onError
					? onError(err)
					: err instanceof CanceledError
					? null
					: console.log(err)
			);

		return () => controller.abort();
	}, [...deps]);

	return {
		data,
		loading,
	};
};
