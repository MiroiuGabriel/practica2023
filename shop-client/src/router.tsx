import { RouteObject, createBrowserRouter } from 'react-router-dom';
import {
	Categories,
	Category,
	CreateProduct,
	Home,
	Products,
	Root,
	SignIn,
	SignUp,
} from './pages';
import { NotFound } from './pages/NotFound';
import { CreateCategory } from './pages/CreateCategory';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/categories/:categoryId/products',
				element: <Category />,
			},
			{
				path: '/admin/products',
				element: <Products />,
			},
			{
				path: '/admin/products/create',
				element: <CreateProduct />,
			},
			{
				path: '/admin/products/create/:productId',
				element: <CreateProduct />,
			},
			{
				path: '/admin/categories',
				element: <Categories />,
			},
			{
				path: '/admin/categories/create',
				element: <CreateCategory />,
			},
			{
				path: '/admin/categories/create/:categoryId',
				element: <CreateCategory />,
			},
			{
				path: '/auth/sign-in',
				element: <SignIn />,
			},
			{
				path: '/auth/sign-up',
				element: <SignUp />,
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
];

export const router = createBrowserRouter(routes);
