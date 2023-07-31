import * as RadixAvatar from '@radix-ui/react-avatar';

type AvatarProps = {
	src: string;
};

export const Avatar: React.FC<AvatarProps> = ({ src }) => {
	return (
		<RadixAvatar.Root className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle ">
			<RadixAvatar.Image
				className="h-full w-full rounded-[inherit] object-cover"
				src={src}
				alt="Avatar"
			/>
		</RadixAvatar.Root>
	);
};
