import { BiSolidShoppingBagAlt } from 'react-icons/bi';

export const NothingFound: React.FC<{
	title: string;
	description: string;
}> = ({ description, title }) => {
	return (
		<div className="flex flex-col my-5 gap-2">
			<BiSolidShoppingBagAlt className="w-28 h-28 text-indigo-500" />
			<h3 className="text-3xl font-semibold">{title}</h3>
			<p className="text-gray-500">{description}</p>
		</div>
	);
};
