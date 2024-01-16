import { useSearchParams } from "@remix-run/react";
import { Link } from "react-router-dom";

export default function Login() {
	const [searchParams] = useSearchParams();
	return (
		<div className='container'>
			<div className='content'>
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
							/>
							Login
						</label>
						<label>
							<input
								type='radio'
								name='loginType'
								value='register'
							/>
							Register
						</label>
					</fieldset>
					<div>
						<label htmlFor='username-input'>Username</label>
						<input
							type='text'
							name='username'
							id='username-input'
						/>
					</div>
					<div>
						<label htmlFor='username-password'>Password</label>
						<input
							type='password'
							name='password'
							id='password-input'
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
