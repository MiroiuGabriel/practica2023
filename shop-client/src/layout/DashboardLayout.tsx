import { Breadcrumb, Pagination } from '../components';

import { Category, Product } from '../services';
import { Link } from 'react-router-dom';
import { PER_PAGE } from '../data/constants';

type DashboardLayoutProps<T> = {
	data?: T[];
	loading: boolean;
	total?: number;
	filter: {
		limit?: number;
		currentPage?: number;
		onPageChange: (page: number) => void;
	};
	title: string;
	tableTitle: string;
	tableDescription: string;
	create: {
		link: string;
		label: string;
	};
	renderSkeleton: (index: number) => React.ReactNode;
	renderHead: () => React.ReactNode;
	renderRow: (index: number, data: T) => React.ReactNode;
	renderFilter: () => React.ReactNode;
	renderNotFound: () => React.ReactNode;
};

export const DashboardLayout = <T extends Product | Category>({
	data,
	loading,
	total,
	create,
	tableDescription,
	tableTitle,
	title,
	renderRow,
	renderSkeleton,
	renderHead,
	renderFilter,
	renderNotFound,
	filter: { currentPage, limit, onPageChange },
}: DashboardLayoutProps<T>) => {
	return (
		<main className="grow px-8 py-8">
			<Breadcrumb className="my-4" />
			<div className="flex justify-between pb-6 border-b border-gray-200">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900">
					{title}
				</h2>
			</div>
			<div className="my-10 flex items-center gap-2">
				<div className="flex flex-col gap-2 grow">
					<p className="font-semibold text-gray-900">{tableTitle}</p>
					<p className="text-sm text-gray-700">{tableDescription}</p>
				</div>
				{renderFilter()}
				<Link
					to={create.link}
					className="h-fit px-3 py-2 text-sm font-semibold ring-1 text-white bg-indigo-600 rounded-md"
				>
					{create.label}
				</Link>
			</div>
			<table className="min-w-full">
				<thead className="border-gray-300 border-b">
					{renderHead()}
				</thead>
				<tbody className="divide-solid divide-y border-t border-gray-300 divide-gray-300">
					{loading
						? [...Array(limit)].map((_, i) => renderSkeleton(i))
						: null}
					{data?.map((d, i) => renderRow(i, d))}
				</tbody>
			</table>
			{!loading && data?.length === 0 ? renderNotFound() : null}
			{total ? (
				<Pagination
					currentPage={currentPage || 1}
					onPageChange={onPageChange}
					pageSize={limit ?? PER_PAGE}
					totalCount={total}
				/>
			) : null}
		</main>
	);
};
