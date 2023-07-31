import { useForm } from 'react-hook-form';
import { Breadcrumb, Input } from '../components';
import { BiSolidShoppingBagAlt } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { ProblemResponse, authService } from '../services';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type FormData = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export const SignUp = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>();

	const navigate = useNavigate();

	const onSubmit = handleSubmit(async data => {
		try {
			await authService.signUp({
				email: data.email,
				password: data.password,
				username: data.username,
			});

			toast.success('Signed up successfully');
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
					Sign up for an account
				</h2>
			</div>
			<form
				className="flex flex-col gap-4 max-w-md py-8"
				onSubmit={onSubmit}
			>
				<BiSolidShoppingBagAlt className="h-8 w-8 text-indigo-600" />
				<Input
					type="text"
					{...register('username', {
						required: 'Username field must not be empty',
						minLength: {
							value: 4,
							message: 'Username must be at least 4 characters',
						},
					})}
					label="Username"
					id="username"
					placeholder="John Doe"
					htmlFor="username"
					errorMessage={errors.email?.message}
				/>
				<Input
					type="email"
					{...register('email', {
						required: 'Email address field must not be empty',
						minLength: {
							value: 4,
							message: 'Email must be at least 4 characters',
						},
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
						minLength: {
							value: 4,
							message: 'Password must be at least 4 characters',
						},
					})}
					label="Password"
					id="password"
					htmlFor="password"
					errorMessage={errors.password?.message}
				/>
				<Input
					type="password"
					{...register('confirmPassword', {
						required: 'Confirm Password field must not be empty',
						validate: (value: string) => {
							if (watch('password') !== value)
								return 'Passwords do not match';
						},
					})}
					label="Confirm Password"
					id="confirmPassword"
					htmlFor="confirmPassword"
					errorMessage={errors.confirmPassword?.message}
				/>
				<button
					type="submit"
					className="mt-2 w-full h-fit px-3 py-2 text-sm font-semibold ring-1 text-white bg-indigo-600 rounded-md"
				>
					Sign Up
				</button>
				<Link to="/auth/sign-in" className="text-gray-500">
					Already have an account?{' '}
					<span className="text-indigo-600">Sign in.</span>
				</Link>
			</form>
		</main>
	);
};
