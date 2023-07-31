import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Input, TextArea } from '../components';
import { useFetch } from '../hooks';
import { Category, categoryService } from '../services';
import { useForm } from 'react-hook-form';
import { CanceledError } from 'axios';
import toast from 'react-hot-toast';
import { getDifferentValues, isSame } from '../utils';

type FormData = {
	name: string;
	description: string;
};

export const CreateCategory = () => {
	const navigate = useNavigate();
	const { categoryId } = useParams();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>();

	const { data: category } = useFetch<Category | undefined>(
		signal =>
			categoryId
				? categoryService.getCategoryById(+categoryId, signal)
				: new Promise(res => res(undefined)),
		[],
		category => categoryId && reset({ ...category }),
		err => {
			if (err instanceof CanceledError || categoryId === undefined)
				return;

			navigate('/admin/categories');
			toast.error("This category doesn't exist");
		}
	);

	const onSubmit = handleSubmit(async data => {
		if (category && categoryId) {
			const updatedProduct: Category = { ...data, id: category.id };

			if (isSame(category, updatedProduct)) {
				toast.error('Please change any field before submitting');
				return;
			}

			const fields = getDifferentValues<Category>(
				category,
				updatedProduct
			);

			fields['id'] = category.id;

			await categoryService.updateCategory(fields as Partial<Category>);
		} else {
			await categoryService.createCategory(data);
		}

		navigate('/admin/categories');
	});

	return (
		<main className="grow px-8 py-8">
			<Breadcrumb className="my-4" />
			<div className="flex justify-between pb-6 border-b border-gray-200">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900">
					Create Category
				</h2>
			</div>
			<form
				className="flex flex-col gap-4 max-w-md py-8"
				onSubmit={onSubmit}
			>
				<Input
					{...register('name', {
						required: 'Name field is required',
					})}
					placeholder="Lenovo X511"
					type="text"
					id="name"
					label="Name"
					htmlFor="name"
					errorMessage={errors.name?.message}
				/>
				<TextArea
					{...register('description', {
						required: 'Description field is required',
						minLength: {
							value: 10,
							message:
								'Description field must have more than 10 characters.',
						},
					})}
					id="description"
					label="Description"
					placeholder="Best product ever!"
					rows={3}
					htmlFor="description"
					errorMessage={errors.description?.message}
				/>
				<button
					type="submit"
					className="mt-2 h-fit px-3 py-2 text-sm font-semibold ring-1 text-white bg-indigo-600 rounded-md"
				>
					Submit
				</button>
			</form>
		</main>
	);
};
