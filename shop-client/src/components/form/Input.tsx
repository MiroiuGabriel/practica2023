import clsx from 'clsx';
import { HTMLProps, forwardRef } from 'react';

export type InputProps = HTMLProps<HTMLInputElement> & {
	errorMessage?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ errorMessage, htmlFor, label, ...rest }, ref) => (
		<div>
			<label
				htmlFor={htmlFor}
				className="block text-sm font-medium leading-6 text-gray-900"
			>
				{label}
			</label>
			<div className="mt-2">
				<input
					ref={ref}
					{...rest}
					className={clsx(
						'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
						errorMessage && 'ring-red-300'
					)}
				/>
				<p className="text-red-600 mt-2">{errorMessage}</p>
			</div>
		</div>
	)
);
