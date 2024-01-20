import type {
	ActionFunctionArgs,
	LinksFunction,
	LoaderFunctionArgs,
} from "@remix-run/node";
import {
	Link,
	json,
	redirect,
	useActionData,
	useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession, login, register } from "~/utils/session.server";
import { commitSession, getSession } from "~/utils/sessions";

interface Fields {
	username?: string;
	password?: string;
	loginType?: string;
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

function validateUrl(url: string) {
	const urls = ["/jokes", "/"];
	if (urls.includes(url)) {
		return url;
	}
	return "/jokes";
}

// export const loader = async ({ request }: LoaderFunctionArgs) => {
// 	const session = await getSession(request.headers.get("Cookie"));
// 	if (session.has("id")) {
// 		return redirect("/jokes");
// 	}
// 	const data = { error: session.get("error") };
// 	return json(data, {
// 		headers: {
// 			"Set-Cookie": await commitSession(session),
// 		},
// 	});
// };

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const username = formData.get("username");
	const password = formData.get("password");
	const loginType = formData.get("loginType");

	const redirectTo =
		validateUrl(formData.get("redirectTo") as string) || "/jokes";
	// rule out the case where the formData is not of type string
	if (
		typeof username !== "string" ||
		typeof password !== "string" ||
		typeof loginType !== "string"
	) {
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

	const fields: Fields = { username, password, loginType };

	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest<Errors>({ fieldErrors, fields, formError: null });
	}

	switch (loginType) {
		case "login": {
			// if there is no user, return error and fields
			const user = await login({ username, password });
			console.log({ user });
			if (!user) {
				return badRequest<Errors>({
					fieldErrors: null,
					fields: { username, password: "" },
					formError: "Incorrect Username or Password.",
				});
			}
			// if there is a user, create session and redirect to /jokes
			return createUserSession(user.id, redirectTo);
		}
		case "register": {
			const userExists = await db.user.findFirst({ where: { username } });
			if (userExists) {
				return badRequest<Errors>({
					fieldErrors: null,
					fields,
					formError: `User with username ${username} already exists.`,
				});
			}

			// create the user
			const user = await register({username, password})
			// create the session and redirect to /jokes
			if(!user) {

				return badRequest({
					fieldErrors: null,
					fields,
					formError: "Something went wrong while creating a user.",
				});
			}
			return createUserSession(user.userId,"/jokes")
		}
		default: {
			return badRequest({
				fieldErrors: null,
				fields,
				formError: "Login type invalid.",
			});
		}
	}

	// set header and redirect to home page (/jokes)
	return redirect("/jokes");
};

export default function Login() {
	const [searchParams] = useSearchParams();
	console.log(searchParams.get("redirectTo"))
	const data = useActionData<typeof action>();
	return (
		<div className='container'>
			<div className='content' data-light=''>
				<h1>Login</h1>
				<p className="error">{data?.formError}</p>
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
								defaultChecked={
									!data?.fields?.loginType ||
									data.fields.loginType === "login"
								}
							/>{" "}
							Login
						</label>
						<label>
							<input
								type='radio'
								name='loginType'
								value='register'
								defaultChecked={
									data?.fields?.loginType === "register"
								}
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
							autoComplete='off'
							defaultValue={data?.fields?.username ?? ""}
							aria-errormessage={
								data?.fieldErrors?.username
									? "username error"
									: undefined
							}
							aria-invalid={Boolean(data?.fieldErrors?.username)}
						/>
						{data?.fieldErrors?.username ? (
							<p
								className='form-validation-error'
								id='username-error'
								role='alert'>
								{data.fieldErrors.username}
							</p>
						) : (
							""
						)}
					</div>
					<div>
						<label htmlFor='password-input'>Password</label>
						<input
							id='password-input'
							name='password'
							type='password'
							defaultValue={data?.fields?.password ?? ""}
							autoComplete='off'
							aria-errormessage={
								data?.fieldErrors?.password
									? "password-error"
									: undefined
							}
							aria-invalid={Boolean(data?.fieldErrors?.password)}
						/>
						{data?.fieldErrors?.password ? (
							<p
								className='form-validation-error'
								id='password-error'
								role='alert'>
								{data.fieldErrors.password}
							</p>
						) : (
							""
						)}
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
