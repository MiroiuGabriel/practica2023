import { forwardRef, type FC } from 'react';
import clsx from 'clsx';
import { IconType } from 'react-icons';

type SidebarButtonProps = {
	text: string;
	icon?: IconType;
} & React.HTMLProps<HTMLButtonElement>;

export const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
	({ text, icon, ...rest }, ref) => {
		const Icon = icon;
		const firstLetter = text[0];

		const isActive = false;

		return (
			<button
				ref={ref}
				{...rest}
				type="button"
				className={clsx(
					'p-2 flex items-center gap-2 font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200 ease-linear',
					isActive ? 'bg-indigo-700 text-white' : 'text-indigo-200'
				)}
			>
				{Icon && <Icon className="w-6 h-6" />}
				{!Icon && (
					<div className="text-white uppercase font-medium border border-indigo-400 rounded-lg flex items-center justify-center w-6 h-6 bg-indigo-500">
						{firstLetter}
					</div>
				)}
				{text}
			</button>
		);
	}
);
