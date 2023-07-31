import { useForm } from 'react-hook-form';
import { Breadcrumb, Input } from '../components';
import { BiSolidShoppingBagAlt } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { ProblemResponse, authService } from '../services';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type FormData = {
	email: string;
	password: string;
};

export const SignIn = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const navigate = useNavigate();

	const onSubmit = handleSubmit(async data => {
		try {
			await authService.signIn('credentials', {
				email: data.email,
				password: data.password,
			});

			toast.success('Signed in successfully');
			navigate('/');
		} catch (err) {
			const message = authService.getAxiosErrorMessage(err);

			toast.error(message);
		}
	});

	return (
		<main className="grow px-8 py-8">
			<Breadcrumb className="my-4" />
			<div className="flex justify-between pb-6 border-b border-gray-200">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900">
					Sign in to your account
				</h2>
			</div>
			<form
				className="flex flex-col gap-4 max-w-md py-8"
				onSubmit={onSubmit}
			>
				<BiSolidShoppingBagAlt className="h-8 w-8 text-indigo-600" />
				<Input
					type="email"
					{...register('email', {
						required: 'Email address field must not be empty',
					})}
					label="Email address"
					id="email"
					placeholder="johndoe@gmail.com"
					htmlFor="email"
					errorMessage={errors.email?.message}
				/>
				<Input
					type="password"
					{...register('password', {
						required: 'Password field must not be empty',
					})}
					label="Password"
					id="password"
					htmlFor="password"
					errorMessage={errors.password?.message}
				/>
				<button
					type="submit"
					className="mt-2 w-full h-fit px-3 py-2 text-sm font-semibold ring-1 text-white bg-indigo-600 rounded-md"
				>
					Sign In
				</button>
				<Link to="/auth/sign-up" className="text-gray-500">
					Don't have an account?{' '}
					<span className="text-indigo-600">Sign up.</span>
				</Link>
			</form>
		</main>
	);
};
