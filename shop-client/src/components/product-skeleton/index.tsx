import { AiFillPicture } from 'react-icons/ai';

export const ProductSkeleton = () => {
	return (
		<div className="animate-pulse">
			<div className="flex items-center justify-center w-full h-48 rounded-md bg-gray-700 lg:h-80">
				<AiFillPicture className="w-10 h-10 text-gray-600" />
			</div>
			<div className="flex mt-4 justify-between items-center">
				<div>
					<div className="h-2.5 rounded-full bg-gray-700 w-48"></div>
					<div className="mt-1 h-2.5  rounded-full bg-gray-700 w-48"></div>
				</div>
				<p className="h-2.5 rounded-full bg-gray-700 w-10"></p>
			</div>
		</div>
	);
};
