import { Link } from 'react-router-dom';
import { DeleteModal } from '..';
import { Product } from '../../services';

export const ProductRow: React.FC<
	Product & {
		onDelete: () => void;
	}
> = ({ categoryId, description, id, image, name, price, onDelete }) => {
	return (
		<tr>
			<td className="text-medium text-sm py-4 pr-3">{id}</td>
			<td className="text-medium text-sm py-4 pr-3">
				<a target="_blank" rel="noopener noreferrer" href={image}>
					<img className="w-8 h-8 rounded-md" src={image} />
				</a>
			</td>
			<td className="text-medium text-sm py-4 pr-3">{name}</td>
			<td className="text-medium text-sm py-4 pr-3 truncate text-ellipsis">
				{description}
			</td>
			<td className="text-medium text-sm py-4 pr-3">
				${price.toFixed(2)}
			</td>
			<td className="text-medium text-sm py-4 pr-3">{categoryId}</td>
			<td className="text-medium text-sm py-4 pr-3 text-indigo-600">
				<Link to={`/admin/products/create/${id}`}>Edit</Link>
			</td>
			<td className="text-medium text-sm py-4 pr-3 text-red-600">
				<DeleteModal
					title="Delete Product"
					description="Are you sure you want to delete this
			product? The selected product will
			be permanently removed. This action
			cannot be undone."
					trigger={<span className="cursor-pointer">Delete</span>}
					onDelete={onDelete}
				/>
			</td>
		</tr>
	);
};
