import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components';
import { AuthProvider, CartProvider, PagesProvider } from '../context';
import { ProtectedPage } from './ProtectedPage';

export const Root = () => {
	return (
		<AuthProvider>
			<PagesProvider>
				<CartProvider>
					<div className="grid grid-cols-[18rem,auto]">
						<Sidebar />
						<ProtectedPage>
							<Outlet />
						</ProtectedPage>
					</div>
				</CartProvider>
			</PagesProvider>
		</AuthProvider>
	);
};
