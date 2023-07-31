import * as RadixPopover from '@radix-ui/react-popover';

type PopoverProps = {
	trigger: React.ReactNode;
	children: React.ReactNode;
};

export const Popover: React.FC<PopoverProps> = ({ trigger, children }) => (
	<RadixPopover.Root>
		<RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
		<RadixPopover.Portal>
			<RadixPopover.Content
				className="rounded w-[260px] bg-white"
				sideOffset={5}
			>
				{children}
				<RadixPopover.Arrow className="fill-white" />
			</RadixPopover.Content>
		</RadixPopover.Portal>
	</RadixPopover.Root>
);
