import * as Dialog from '@radix-ui/react-alert-dialog';
import { CiWarning } from 'react-icons/ci';

type ModalProps = {
	trigger: React.ReactNode;
	onDelete: () => void;
	title: string;
	description: string;
};

export const DeleteModal: React.FC<ModalProps> = ({
	trigger,
	onDelete,
	description,
	title,
}) => {
	return (
		<div>
			<Dialog.Root>
				<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="bg-gray-500 bg-opacity-75 fixed inset-0" />
					<Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
						<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<CiWarning className="h-6 w-6 text-red-600" />
								</div>
								<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
									<h3
										className="text-base font-semibold leading-6 text-gray-900"
										id="modal-title"
									>
										{title}
									</h3>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											{description}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<Dialog.Action
								onClick={onDelete}
								type="button"
								className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
							>
								Delete
							</Dialog.Action>
							<Dialog.Cancel
								type="button"
								className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							>
								Cancel
							</Dialog.Cancel>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
};
