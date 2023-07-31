import { useState } from 'react';
import { useDebounce, useFetch, useFilter } from '../hooks';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Category, CategoryFilter, categoryService } from '../services';
import {
	Dropdown,
	DropdownItem,
	CategoryRow,
	CategoryRowSkeleton,
	NothingFound,
} from '../components';
import { useNavigate } from 'react-router-dom';
import { PiSortAscendingBold, PiSortDescendingBold } from 'react-icons/pi';
import { FiSearch } from 'react-icons/fi';
import { PaginatedResponse } from '../services';

export const Categories = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const searchTerm = useDebounce(search, 300);

	const {
		filter: { limit, offset, sort, currentPage },
		onPageChange,
		onPerPageChange,
		onSortChange,
	} = useFilter();

	const query = {
		offset,
		limit,
		search: searchTerm,
		sort,
		currentPage,
	};

	const { loading, data } = useFetch<PaginatedResponse<Category>>(
		signal =>
			categoryService.getCategories(
				query as Partial<CategoryFilter>,
				signal
			),
		[query.offset, query.limit, query.search, query.sort]
	);

	const onSearch = (text: string) => {
		setSearch(text);
	};

	return (
		<DashboardLayout
			title="View Categories"
			tableDescription="A list of all categories in your shop."
			tableTitle="Categories"
			data={data?.items}
			loading={loading}
			filter={{
				limit,
				currentPage,
				onPageChange,
			}}
			total={data?.total}
			create={{
				link: '/admin/categories/create',
				label: 'Add category',
			}}
			renderHead={() => (
				<tr>
					<th className="text-sm text-gray-900 text-left pr-3 py-3.5 font-semibold">
						Id
					</th>
					<th className="text-sm text-gray-900 text-left pr-3 py-3.5 font-semibold">
						Name
					</th>

					<th className="text-sm text-gray-900 text-left pr-3 py-3.5 font-semibold">
						Description
					</th>
				</tr>
			)}
			renderRow={(_, category) => (
				<CategoryRow
					key={category.id}
					{...category}
					onDelete={async () => {
						await categoryService.deleteCategory(category.id);
						onPageChange(1);
						navigate(0);
					}}
				/>
			)}
			renderSkeleton={index => (
				<CategoryRowSkeleton key={'category-row-skeleton-' + index} />
			)}
			renderFilter={() => (
				<>
					<Dropdown label="Per page">
						<DropdownItem
							label="2"
							active={limit === 2}
							onValueChange={onPerPageChange}
							value={2}
						/>
						<DropdownItem
							label="4"
							active={limit === 4}
							onValueChange={onPerPageChange}
							value={4}
						/>
						<DropdownItem
							label="6"
							active={limit === 6}
							onValueChange={onPerPageChange}
							value={6}
						/>
						<DropdownItem
							label="8"
							active={limit === 8}
							onValueChange={onPerPageChange}
							value={8}
						/>
					</Dropdown>
					{sort === 'asc' ? (
						<PiSortAscendingBold
							title="desc"
							className="h-6 w-6 cursor-pointer"
							onClick={() => onSortChange('desc')}
						/>
					) : (
						<PiSortDescendingBold
							className="h-6 w-6 cursor-pointer"
							title="asc"
							onClick={() => onSortChange('asc')}
						/>
					)}
					<div className="flex items-center  mx-5 rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
						<FiSearch className="w-4 h-4" />
						<input
							value={search}
							onChange={ev => onSearch(ev.target.value)}
							placeholder="Laptop"
							className="pl-3 outline-none grow"
						/>
					</div>
				</>
			)}
			renderNotFound={() => (
				<NothingFound
					title="No Categories Found"
					description="Your search did not match any categories. Please try again."
				/>
			)}
		/>
	);
};
