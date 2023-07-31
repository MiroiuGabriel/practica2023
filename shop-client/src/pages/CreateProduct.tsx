import { useForm } from 'react-hook-form';
import { Breadcrumb, Select, TextArea } from '../components';
import { useFetch } from '../hooks';
import { Input } from '../components';
import { Product, productService, categoryService } from '../services';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CanceledError } from 'axios';
import { getDifferentValues, isSame } from '../utils';

export type FormData = {
	name: string;
	description: string;
	image: string;
	price: number;
	categoryId: number;
};

export const CreateProduct = () => {
	const navigate = useNavigate();
	const { data } = useFetch(signal =>
		categoryService.getCategories({ offset: 0, limit: 100 }, signal)
	);
	const { productId } = useParams();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>();

	const { data: product } = useFetch<Product | null>(
		signal =>
			productId
				? productService.getProductById(+productId, signal)
				: new Promise(res => res(null)),
		[],
		product => productId && reset({ ...product }),
		err => {
			if (err instanceof CanceledError || productId === null) return;

			navigate('/admin/products');
			toast.error("This product doesn't exist");
		}
	);

	const onSubmit = handleSubmit(async data => {
		if (product && productId) {
			const updatedProduct: Product = { ...data, id: product.id };

			if (isSame(product, updatedProduct)) {
				toast.error('Please change any field before submitting');
				return;
			}

			const fields = getDifferentValues<Product>(product, updatedProduct);

			fields['id'] = product.id;

			await productService.updateProduct(fields as Partial<Product>);
		} else {
			await productService.createProduct(data);
		}

		navigate('/admin/products');
	});

	return (
		<main className="grow px-8 py-8">
			<Breadcrumb className="my-4" />
			<div className="flex justify-between pb-6 border-b border-gray-200">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900">
					Create Product
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
				<Input
					type="url"
					{...register('image', {
						required: 'Image URL field is required',
					})}
					id="image"
					label="Image URL"
					placeholder="https://placeholder.com"
					htmlFor="image"
					errorMessage={errors.image?.message}
				/>
				<Input
					type="number"
					step={0.01}
					id="price"
					{...register('price', {
						required: 'Price field is required',
						valueAsNumber: true,
					})}
					placeholder="2.99"
					min={1}
					max={10000}
					label="Price"
					htmlFor="price"
					errorMessage={errors.price?.message}
				/>
				<Select
					id="categoryId"
					{...register('categoryId', {
						required: 'Category field is required',
						valueAsNumber: true,
					})}
					label="Category"
					errorMessage={errors.categoryId?.message}
				>
					<>
						<option value=""></option>
						{data?.items?.map(category => (
							<option value={category.id} key={category.id}>
								{category.name}
							</option>
						))}
					</>
				</Select>
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
