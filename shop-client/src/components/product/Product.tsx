import { Link } from 'react-router-dom';
import { Product as ProductProps } from '../../services';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useCart } from '../../context';
import toast from 'react-hot-toast';

export const Product: React.FC<ProductProps> = ({
	id,
	image,
	description,
	name,
	price,
}) => {
	const { addToCart } = useCart();

	return (
		<div>
			<Link to={`/product/${id}`} className="group relative">
				<div className="w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
					<img
						src={image}
						alt={description}
						className="h-full w-full object-cover object-center lg:h-full lg:w-full select-none"
					/>
				</div>
				<div className="mt-4 flex justify-between items-center">
					<div>
						<h3 className="text-sm text-gray-700 font-medium">
							{name}
						</h3>
						<p className="mt-1 text-sm text-gray-500 line-clamp-2 max-w-sm">
							{description}
						</p>
					</div>
					<p className="text-sm font-medium text-gray-900 ml-4">
						${price.toFixed(2)}
					</p>
				</div>
			</Link>
			<button
				onClick={() => {
					try {
						addToCart(id);
						toast.success('Product added to cart successfully');
					} catch (err) {
						toast.success(
							'Failed adding to cart. Please try again'
						);
					}
				}}
				className="my-4 hover:bg-indigo-500 bg-indigo-600 py-2 px-4 font-semibold text-sm text-white rounded-md flex gap-4 items-center w-full justify-center"
			>
				<AiOutlineShoppingCart className="w-6 h-6" /> Add to cart
			</button>
		</div>
	);
};
