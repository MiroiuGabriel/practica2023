import clsx from 'clsx';

export const Spinner: React.FC<React.HTMLProps<HTMLDivElement>> = ({
	className,
	...rest
}) => {
	return (
		<div
			className={clsx(
				'animate-spin w-6 h-6 border-4 border-indigo-700 border-t-white rounded-full',
				className
			)}
			{...rest}
		></div>
	);
};
