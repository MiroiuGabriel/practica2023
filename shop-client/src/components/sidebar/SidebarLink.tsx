import { NavLink } from 'react-router-dom';
import { type FC } from 'react';
import clsx from 'clsx';
import { IconType } from 'react-icons';

type SidebarLinkProps = {
	path: string;
	text: string;
	icon?: IconType;
	customElement?: React.ReactNode;
};

export const SidebarLink: FC<SidebarLinkProps> = ({ path, text, icon }) => {
	const Icon = icon;
	const firstLetter = text[0];

	return (
		<NavLink
			to={path}
			className={({ isActive }) =>
				clsx(
					'p-2 flex items-center gap-2 font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200 ease-linear',
					isActive ? 'bg-indigo-700 text-white' : 'text-indigo-200'
				)
			}
		>
			{Icon && <Icon className="w-6 h-6" />}
			{!Icon && (
				<div className="text-white uppercase font-medium border border-indigo-400 rounded-lg flex items-center justify-center w-6 h-6 bg-indigo-500">
					{firstLetter}
				</div>
			)}
			{text}
		</NavLink>
	);
};
