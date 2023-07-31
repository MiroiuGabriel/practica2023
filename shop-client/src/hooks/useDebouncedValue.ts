import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number) => {
	const [state, setState] = useState<T>(value);

	useEffect(() => {
		const timeoutId = setTimeout(() => setState(value), delay);
		return () => clearTimeout(timeoutId);
	}, [value]);

	return state;
};
