import { useLocation, useNavigate } from 'react-router-dom';
import { usePages } from '../context';
import { Spinner } from '../components';
import { NotFound } from './NotFound';

export const LoadingPage = () => {
	return (
		<div className="w-full min-h-screen flex justify-center items-center">
			<Spinner />
		</div>
	);
};

type ProtectedPageProps = {
	children: React.ReactNode;
};

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
	const { pages } = usePages();
	const location = useLocation();

	if (!pages) return <LoadingPage />;

	if (
		pages.other.filter(x => {
			return location.pathname === x.route;
		}).length === 1
	)
		return children;
	else return <NotFound />;
};
