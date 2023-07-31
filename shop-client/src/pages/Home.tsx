import {
	Pagination,
	Product,
	FilterOptions,
	ProductSkeleton,
	NothingFound,
} from '../components';
import { useFetch, useFilter } from '../hooks';

import { PER_PAGE } from '../data/constants';
import {
	PaginatedResponse,
	type Product as ProductType,
	productService,
} from '../services';
import { Outlet } from 'react-router-dom';

export const Home = () => {
	const {
		filter,
		onBudgetChange,
		onPageChange,
		onPerPageChange,
		onSortChange,
	} = useFilter();

	const { data, loading } = useFetch<PaginatedResponse<ProductType>>(
		signal => productService.getProducts(filter, signal),
		[
			filter.budget,
			filter.categoryId,
			filter.limit,
			filter.offset,
			filter.search,
			filter.sort,
		]
	);

	return (
		<>
			<Outlet />
			<main className="grow px-8 py-8">
				<div className="flex justify-between pb-6 border-b border-gray-200">
					<h2 className="text-4xl font-bold tracking-tight text-gray-900">
						All Products
					</h2>
					<div className="flex items-center gap-4">
						<FilterOptions
							filter={filter}
							onBudgetChange={onBudgetChange}
							onSortChange={onSortChange}
							onPerPageChange={onPerPageChange}
						/>
					</div>
				</div>
				{data?.items?.length === 0 && (
					<NothingFound
						description="Your search did not match any products. Please try again."
						title="No Products Found"
					/>
				)}
				<div className="w-full py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{loading
							? [...Array(filter.limit)].map((_, i) => (
									<ProductSkeleton
										key={'skeleton-home' + i}
									/>
							  ))
							: null}
						{data?.items?.map(product => (
							<Product key={product.id} {...product} />
						))}
					</div>
				</div>
				{data?.total ? (
					<Pagination
						totalCount={data?.total}
						currentPage={filter?.currentPage || 1}
						pageSize={filter.limit ?? PER_PAGE}
						onPageChange={onPageChange}
					/>
				) : null}
			</main>
		</>
	);
};
