import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';
import clsx from 'clsx';

type BreadcrumbProps = {
	className?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
	const location = useLocation();

	const paths = useMemo(
		() => location.pathname.split('/').filter(path => path.length !== 0),
		[location.pathname]
	);

	return (
		<ol
			role="list"
			className={clsx('flex list-none items-center', className)}
		>
			<li>
				<Link to="/">
					<AiFillHome className="w-5 h-5 text-slate-500 hover:text-slate-700" />
				</Link>
			</li>
			{paths.map((path, index) => (
				<li className="flex items-center" key={path}>
					<MdKeyboardArrowRight className="w-5 h-5 text-slate-500 mx-4" />
					<Link
						to={`/${paths.slice(0, index + 1).join('/')}`}
						className="capitalize font-medium text-sm text-gray-500 hover:text-gray-700"
					>
						{path}
					</Link>
				</li>
			))}
		</ol>
	);
};
