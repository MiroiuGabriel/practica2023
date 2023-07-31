import { BiSolidShoppingBagAlt, BiCategory } from 'react-icons/bi';
import { AiOutlineHome, AiOutlineCodeSandbox } from 'react-icons/ai';
import { SidebarLink } from './SidebarLink';
import { SidebarButton } from './SidebarButton';
import { Popover } from '../popover';
import { Avatar } from '../avatar';
import { Spinner } from '..';
import { Category, PaginatedResponse, categoryService } from '../../services';
import { useFetch } from '../../hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, usePages } from '../../context';
import { authService } from '../../services';
import { IconType } from 'react-icons';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Cart } from '../cart';

const iconMapping: Record<string, IconType> = {
	'/': AiOutlineHome,
	'/admin/categories': BiCategory,
	'/admin/products': AiOutlineCodeSandbox,
};

export const Sidebar = () => {
	const user = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const { pages } = usePages();

	const { data, loading } = useFetch<PaginatedResponse<Category>>(
		signal =>
			categoryService.getCategories({ offset: 0, limit: 100 }, signal),
		[location.key]
	);

	const logout = () => {
		authService.logout();
		navigate('/');
	};

	return (
		<div className="bg-indigo-600 px-6 py-4 w-72 min-h-screen flex flex-col">
			<BiSolidShoppingBagAlt className="h-8 w-8 text-white mb-5" />
			<div className="flex flex-col grow gap-1.5">
				{pages?.sidebarPages.map(page => (
					<SidebarLink
						key={page.route}
						path={page.route}
						text={page.name}
						icon={iconMapping[page.route]}
					/>
				))}
				{!loading && (
					<Cart>
						<SidebarButton
							text="Cart"
							icon={AiOutlineShoppingCart}
						/>
					</Cart>
				)}
				{loading ? <Spinner className="my-2" /> : null}
				<p className="mt-4 text-sm text-indigo-200 font-semibold">
					Categories
				</p>
				{loading && <Spinner className="my-2" />}
				{data?.items.map(category => (
					<SidebarLink
						key={category.id}
						text={category.name}
						path={`/categories/${category.id}/products`}
					/>
				))}

				<Popover
					trigger={
						<div className="flex items-center gap-2 text-indigo-200 font-semibold mt-auto hover:bg-indigo-700 p-2 rounded-md cursor-pointer transition-colors duration-200 ease-linear">
							<Avatar
								src={
									'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
								}
							/>
							{user?.username ?? 'Please sign in'}
						</div>
					}
				>
					{user ? (
						<div className="flex flex-col text-center divide-solid divide-y divide-gray-300 focus:outline-none">
							<Link
								to="/profile"
								className="w-full hover:bg-gray-300 p-2 font-semibold rounded-tr-md rounded-tl-md transition-colors duration-200 ease-linear focus:outline-none focus:bg-gray-300"
							>
								Profile
							</Link>

							<button
								onClick={logout}
								className="w-full hover:bg-gray-300 p-2 font-semibold rounded-bl-md rounded-br-md transition-colors duration-200 ease-linear focus:outline-none focus:bg-gray-300"
							>
								Logout
							</button>
						</div>
					) : (
						<div className="flex flex-col text-center divide-solid divide-y divide-gray-300 focus:outline-none">
							<Link
								to="/auth/sign-in"
								className="w-full hover:bg-gray-300 p-2 font-semibold rounded-tr-md rounded-tl-md transition-colors duration-200 ease-linear focus:outline-none focus:bg-gray-300"
							>
								Sign In
							</Link>

							<Link
								to="/auth/sign-up"
								className="w-full hover:bg-gray-300 p-2 font-semibold rounded-bl-md rounded-br-md transition-colors duration-200 ease-linear focus:outline-none focus:bg-gray-300"
							>
								Sign up
							</Link>
						</div>
					)}
				</Popover>
			</div>
		</div>
	);
};
