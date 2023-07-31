import { createContext, useState, useMemo, useContext } from 'react';
import {
	CartProduct,
	LocalStorageProvider,
	ServerProvider,
	getCartService,
} from '../services/cartService';
import { useAuth } from '.';
import { useFetch } from '../hooks';

type CartContextProps = {
	products: CartProduct[];
	addToCart: (productId: number) => void;
	removeFromCart: (productId: number) => void;
	loading: boolean;
	tax: number;
	shipping: number;
	total: number;
	subtotal: number;
};

const CartContext = createContext<CartContextProps>({
	addToCart: () => {},
	loading: false,
	products: [],
	removeFromCart: () => {},
	shipping: 10.99,
	tax: 12.5,
	total: 0,
	subtotal: 0,
});

type CartProviderProps = {
	children: React.ReactNode;
};

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
	const [products, setProducts] = useState<CartProduct[]>([]);

	const user = useAuth();

	// Service Dependency injection

	const cartService = useMemo(
		() =>
			getCartService(
				user ? new ServerProvider() : new LocalStorageProvider()
			),
		[user]
	);

	const { loading } = useFetch(
		signal => cartService.get(signal),
		[user],
		p => {
			//logic
			setProducts(p);
		}
	);

	const addToCart = async (productId: number) => {
		const product = await cartService.add(productId);

		const updatedProducts = [...products];
		const index = updatedProducts.findIndex(p => p.id === product.id);

		const isInCart = index !== -1;

		if (isInCart) {
			updatedProducts[index] = product;
			setProducts(updatedProducts);
			return;
		}

		setProducts(prev => [...prev, product]);
	};

	const removeFromCart = async (productId: number) => {
		const product = await cartService.remove(productId);

		if (product) {
			const updatedProducts = [...products];
			const index = updatedProducts.findIndex(p => p.id === product.id);

			updatedProducts[index] = product;
			setProducts(updatedProducts);
			return;
		}

		setProducts(prev => prev.filter(p => p.id !== productId));
	};

	const tax = 12.5;
	const shipping = 10.99;

	const subtotal = products
		.map(p => p.price * p.quantity)
		.reduce((acc, prod) => prod + acc, 0);

	const total = subtotal + tax + shipping;

	return (
		<CartContext.Provider
			value={{
				products,
				addToCart,
				removeFromCart,
				loading,
				shipping,
				tax,
				total,
				subtotal,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
