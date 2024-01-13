import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { LinksFunction, json } from "@remix-run/node";
import stylesUrl from "../styles/jokes.css";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => [
	{ href: stylesUrl, rel: "stylesheet" },
];

export const loader = async () => {
	try {
		const jokes = await db.joke.findMany({
			orderBy: { createdAt: "desc" },
			select: { name: true, id: true },
			take: 5,
		});
		return json({ jokeListItems: jokes });
	} catch (error) {
		throw new Response("Not found", { status: 404 });
	}
};

export default function Jokes() {
	const data = useLoaderData<typeof loader>();
	return (
		<div className='jokes-layout'>
			<header className='jokes-header'>
				<div className='container'>
					<h1 className='home-link'>
						<Link
							to='/'
							title='Remix Jokes'
							aria-label='Remix Jokes'>
							<span className='logo'>🤪</span>
							<span className='logo-medium'>J🤪KES</span>
						</Link>
					</h1>
				</div>
			</header>
			<main className='jokes-main'>
				<div className='container'>
					<div className='jokes-list'>
						<Link to='.'>Get a random joke</Link>
						<p>Here are a few more jokes to check out:</p>
						<ul>
							{data.jokeListItems.map(({ id, name }) => (
								<li key={id}>
									<Link to={id}>{name}</Link>
								</li>
							))}
						</ul>
						<Link to='new' className='button'>
							Add your own
						</Link>
					</div>
					<div className='jokes-outlet'>
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
