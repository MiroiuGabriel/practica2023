import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

type DropdownProps = {
	label: string;
	children: React.ReactNode;
};

export const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="group inline-flex justify-center text-sm font-medium outline-none focus-visible:outline select-none"
					aria-label={label}
				>
					{label}
					<MdKeyboardArrowDown className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					side="bottom"
					align="end"
					sideOffset={8}
					className="select-none ring ring-black ring-opacity-5 shadow-2xl bg-white rounded-md transition ease-out duration-100 opacity-0 scale-95 data-[side=bottom]:opacity-100 data-[side=bottom]:scale-100"
				>
					{children}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

type DropdownItemProps = DropdownMenu.DropdownMenuItemProps & {
	onValueChange: (value: string | number) => void;
	value: string | number;
	label: string;
	active: boolean;
};

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
	({ onValueChange, className, value, label, active, ...rest }, ref) => {
		return (
			<DropdownMenu.Item
				{...rest}
				onClick={() => onValueChange(value)}
				ref={ref}
				className={clsx(
					'first:rounded-tr-md first:rounded-tl-md last:rounded-bl-md last:rounded-br-md font-medium text-sm py-2 px-4 block outline-none hover:bg-gray-100 cursor-pointer',
					active ? 'text-gray-900 bg-gray-100' : 'text-gray-500',
					className
				)}
			>
				{label}
			</DropdownMenu.Item>
		);
	}
);
