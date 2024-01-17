import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import {
	Link,
	redirect,
	useActionData,
	useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { badRequest } from "~/utils/request.server";

interface Fields {
	username?: string;
	password?: string;
}

interface Errors {
	fieldErrors: Fields | null;
	fields: Fields | null;
	formError: string | null;
}

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesUrl },
];

const validateUsername = (content: string) => {
	if (content.length < 3) {
		return "That username is too short.";
	}
};

const validatePassword = (content: string) => {
	if (content.length < 6) {
		return "That password is too short, pls choose a stronger password.";
	}
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const username = formData.get("username");
	const password = formData.get("password");
	// rule out the case where the formData is not of type string
	if (typeof username !== "string" || typeof password !== "string") {
		return badRequest<Errors>({
			fieldErrors: null,
			fields: null,
			formError: "Form not submitted correctly.",
		});
	}

	// form validation
	const fieldErrors: Fields = {
		username: validateUsername(username),
		password: validatePassword(password),
	};

	const fields: Fields = { username, password };

	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest<Errors>({ fieldErrors, fields, formError: null });
	}

	return redirect("/jokes");
};

export default function Login() {
	const [searchParams] = useSearchParams();
	const data = useActionData();

	console.log(data, "data");
	return (
		<div className='container'>
			<div className='content' data-light=''>
				<h1>Login</h1>
				<form method='post'>
					<input
						type='hidden'
						name='redirectTo'
						value={searchParams.get("redirectTo") ?? undefined}
					/>
					<fieldset>
						<legend className='sr-only'>Login or Register?</legend>
						<label>
							<input
								type='radio'
								name='loginType'
								value='login'
								defaultChecked
							/>{" "}
							Login
						</label>
						<label>
							<input
								type='radio'
								name='loginType'
								value='register'
							/>{" "}
							Register
						</label>
					</fieldset>
					<div>
						<label htmlFor='username-input'>Username</label>
						<input
							type='text'
							id='username-input'
							name='username'
						/>
					</div>
					<div>
						<label htmlFor='password-input'>Password</label>
						<input
							id='password-input'
							name='password'
							type='password'
						/>
					</div>
					<button type='submit' className='button'>
						Submit
					</button>
				</form>
			</div>
			<div className='links'>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/jokes'>Jokes</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
