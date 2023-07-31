import { useSearchParams } from 'react-router-dom';
import { clamp } from '../utils';
import { MAX_BUDGET, PER_PAGE } from '../data/constants';
import { Filter, Order } from '../services';

export type FilterProps = {
	filter: Filter;
	onPageChange: (page: number) => void;
	onSortChange: (value: string | number) => void;
	onPerPageChange: (value: string | number) => void;
	onBudgetChange: (value: string | number) => void;
};

export const useFilter = (): FilterProps => {
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = Number(searchParams.get('page')) || 1;
	const perPage = clamp(PER_PAGE, 8, Number(searchParams.get('perPage')));
	const sort: Order = (searchParams.get('sort') as Order) ?? 'asc';
	const budget = Number(searchParams.get('budget')) || MAX_BUDGET;

	const offset = (currentPage - 1) * perPage;

	const onPageChange = (page: number) => {
		setSearchParams(params => {
			params.set('page', page.toString());
			return params;
		});
	};

	const onSortChange = (value: string | number) => {
		const val = value as string;

		setSearchParams(params => {
			params.set('sort', val);
			return params;
		});
	};

	const onPerPageChange = (value: string | number) => {
		const val = value as number;

		setSearchParams(params => {
			params.set('perPage', val.toString());
			params.set('page', '1');

			return params;
		});
	};
	const onBudgetChange = (value: string | number) => {
		const val = value as number;

		setSearchParams(params => {
			params.set('budget', val.toString());
			params.set('page', '1');

			return params;
		});
	};

	return {
		filter: {
			offset,
			limit: perPage,
			sort,
			budget,
			currentPage,
		},
		onBudgetChange,
		onPageChange,
		onPerPageChange,
		onSortChange,
	};
};
