import { Outlet, useParams } from 'react-router-dom';
import {
	Pagination,
	Product,
	FilterOptions,
	ProductSkeleton,
	NothingFound,
	Breadcrumb,
} from '../components';
import { useFilter, useFetch } from '../hooks';
import { PER_PAGE } from '../data/constants';
import {
	type Product as ProductType,
	PaginatedResponse,
	productService,
} from '../services';
import {
	type Category as CategoryType,
	categoryService,
} from '../services/categoryService';

export const Category = () => {
	const { categoryId } = useParams();
	const id = +categoryId!;

	const { data: category } = useFetch<CategoryType | undefined>(
		signal => categoryService.getCategoryById(id, signal),
		[id]
	);

	const {
		filter,
		onBudgetChange,
		onPageChange,
		onPerPageChange,
		onSortChange,
	} = useFilter();

	const query = { ...filter, categoryId: id };

	const { data, loading: productsLoading } = useFetch<
		PaginatedResponse<ProductType>
	>(
		signal => productService.getProducts(query, signal),
		[
			query.budget,
			query.categoryId,
			query.offset,
			query.search,
			query.sort,
			query.limit,
			query.categoryId,
		]
	);

	return (
		<>
			<Outlet />
			<main className="grow px-8 py-8">
				<Breadcrumb className="my-4" />
				<div className="flex justify-between pb-6 border-b border-gray-200 items-center">
					<div className="flex flex-col gap-2">
						<h2 className="text-4xl font-bold tracking-tight text-gray-900">
							{category?.name}
						</h2>
						<p className="text-gray-500 text-sm">
							{category?.description}
						</p>
					</div>
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
						{productsLoading
							? [...Array(filter.limit)].map((_, i) => (
									<ProductSkeleton key={'skeleton-cat' + i} />
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
