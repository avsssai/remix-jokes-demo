import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async (params: LoaderFunctionArgs) => {
	const count = await db.joke.count();
	const random = Math.floor(Math.random() * count);
	const [randomJoke] = await db.joke.findMany({
		skip: random,
		take: 1,
	});
	return json({ joke: randomJoke });
};

export default function Index() {
	const { joke } = useLoaderData<typeof loader>();

	return (
		<div>
			<p>{joke.name}</p>
			<p>{joke.content}</p>
			<p>
				<Link to={`/jokes/${joke.id}`}>{joke.name} Permalink</Link>
			</p>
		</div>
	);
}
