import * as Dialog from '@radix-ui/react-dialog';
import { GrFormClose } from 'react-icons/gr';
import { useCart } from '../../context';
import { CartProduct } from '../../services/cartService';
import { NothingFound, Spinner } from '..';
import { Link } from 'react-router-dom';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

export type CartProps = {
	children: React.ReactNode;
};

const CartProduct: React.FC<CartProduct> = ({
	description,
	image,
	name,
	price,
	id,
	quantity,
}) => {
	const { removeFromCart, addToCart } = useCart();
	return (
		<div>
			<Link
				to={`/product/${id}`}
				className="flex gap-6 py-6 group cursor-pointer"
			>
				<img
					src={image}
					alt={description}
					className="h-16 w-16 aspect-video select-none"
				/>
				<div className="flex justify-between grow">
					<div className="flex flex-col gap-1 mr-2">
						<p className="text-md text-gray-700 font-semibold group-hover:underline">
							{name}
						</p>
						<p className="text-sm text-gray-500 line-clamp-2">
							{description}
						</p>
					</div>
					<p className="text-gray-900 text-sm font-medium">
						${price.toFixed(2)}
					</p>
				</div>
			</Link>
			<div className="flex">
				<button
					onClick={() => addToCart(id)}
					className="w-8 h-8 flex items-center justify-center border hover:bg-gray-200 rounded-tl-md roud-bl-md"
				>
					<AiOutlinePlus />
				</button>
				<p className="w-8 h-8 flex items-center justify-center border">
					{quantity}
				</p>
				<button
					onClick={() => removeFromCart(id)}
					className="w-8 h-8 flex items-center justify-center border hover:bg-gray-200 rounded-tr-md roud-br-md"
				>
					<AiOutlineMinus />
				</button>
			</div>
		</div>
	);
};

export const Cart: React.FC<CartProps> = ({ children }) => {
	const { products, loading, total, subtotal, shipping, tax } = useCart();

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="bg-gray-500 bg-opacity-75 fixed inset-0" />
				<Dialog.Content className="bg-white fixed right-0 top-0 min-h-screen w-96 border-l  px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div className="flex gap-4 items-center">
						<Dialog.Close>
							<GrFormClose className="w-6 h-6 text-black" />
						</Dialog.Close>
						<Dialog.Title className="text-xl font-semibold">
							Your Cart
						</Dialog.Title>
					</div>
					<div className="flex flex-col divide-y divide-gray-200 space-y-2 pt-4">
						{products.map(p => (
							<CartProduct {...p} key={p.id} />
						))}
						{loading && <Spinner />}
					</div>
					{subtotal ? (
						<>
							<div className="flex flex-col border-y gap-4 py-8 my-2 mb-8">
								<div className="flex justify-between">
									<p className="text-sm font-medium text-gray-500">
										Subtotal
									</p>
									<p className="text-sm font-medium text-gray-900">
										${subtotal.toFixed(2)}
									</p>
								</div>
								<div className="flex justify-between">
									<p className="text-sm font-medium text-gray-500">
										Shipping
									</p>
									<p className="text-sm font-medium text-gray-900">
										${shipping.toFixed(2)}
									</p>
								</div>
								<div className="flex justify-between">
									<p className="text-sm font-medium text-gray-500">
										Taxes
									</p>
									<p className="text-sm font-medium text-gray-900">
										${tax.toFixed(2)}
									</p>
								</div>
							</div>
							<div className="flex justify-between text-base font-medium">
								<p>Total</p>
								<p>${total.toFixed(2)}</p>
							</div>
							<button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 w-full my-5 rounded-md text-white font-semibold">
								Checkout
							</button>{' '}
						</>
					) : (
						<NothingFound
							title="No products in cart"
							description="Please browse our finest products"
						/>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
