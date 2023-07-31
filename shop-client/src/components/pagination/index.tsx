import clsx from 'clsx';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useMemo } from 'react';
import { clamp } from '../../utils/clamp';

type PaginationProps = {
	totalCount: number;
	currentPage: number;
	pageSize: number;
	onPageChange: (pageNumber: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
	totalCount,
	currentPage,
	pageSize,
	onPageChange,
}) => {
	const numberOfPages = Math.max(1, Math.ceil(totalCount / pageSize));

	const pages = useMemo(
		() => [...Array(numberOfPages)].map((_, i) => i + 1),
		[numberOfPages]
	);

	const onNext = () => {
		const nextPage = clamp(1, numberOfPages, currentPage + 1);
		if (nextPage === currentPage) return;
		onPageChange(nextPage);
	};

	const onPrevious = () => {
		const previousPage = clamp(1, numberOfPages, currentPage - 1);
		if (previousPage === currentPage) return;
		onPageChange(previousPage);
	};

	return (
		<nav className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<nav
						className="isolate inline-flex -space-x-px rounded-md shadow-sm"
						aria-label="Pagination"
					>
						<button
							disabled={currentPage === 1}
							onClick={onPrevious}
							className="disabled:bg-gray-100 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
						>
							<MdKeyboardArrowLeft className="w-5 h-5" />
						</button>
						{pages.map(page => (
							<button
								onClick={() =>
									onPageChange(clamp(1, numberOfPages, page))
								}
								key={page}
								className={clsx(
									'inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
									page === currentPage &&
										'z-10 bg-indigo-600 hover:bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
								)}
								aria-current="page"
							>
								{page}
							</button>
						))}
						<button
							disabled={numberOfPages === currentPage}
							onClick={onNext}
							className="disabled:bg-gray-100 relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50  focus:outline-offset-0"
						>
							<MdKeyboardArrowRight className="w-5 h-5" />
						</button>
					</nav>
				</div>
			</div>
		</nav>
	);
};
