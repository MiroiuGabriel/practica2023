import { Link } from 'react-router-dom';
import { Category } from '../../services';
import { DeleteModal } from '..';

export const CategoryRow: React.FC<
	Category & {
		onDelete: () => void;
	}
> = ({ description, id, name, onDelete }) => {
	return (
		<tr>
			<td className="text-medium text-sm py-4 pr-3">{id}</td>
			<td className="text-medium text-sm py-4 pr-3">{name}</td>
			<td className="text-medium text-sm py-4 pr-3">{description}</td>
			<td className="text-medium text-sm py-4 pr-3 text-indigo-600">
				<Link to={`/admin/categories/create/${id}`}>Edit</Link>
			</td>
			<td className="text-medium text-sm py-4 pr-3 text-red-600">
				<DeleteModal
					title="Delete Category"
					description="Are you sure you want to delete this
                category? The selected product will
                be permanently removed. This action
                cannot be undone."
					trigger={<span className="cursor-pointer">Delete</span>}
					onDelete={onDelete}
				/>
			</td>
		</tr>
	);
};
