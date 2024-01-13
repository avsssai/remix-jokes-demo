import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { jokeId } = params;
	invariant(params.jokeId, "Joke Id missing from params.");
	const joke = await db.joke.findUnique({
		where: {
			id: jokeId,
		},
	});
	if (!SingleJoke) {
		throw new Error("Joke not found.");
	}
	return json({ singleJoke: joke });
};

export default function SingleJoke() {
	const { singleJoke } = useLoaderData<typeof loader>();
	return (
		<div>
			<p>{singleJoke?.name}</p>
			<p>{singleJoke?.content}</p>
			<Link to={`.`}>{singleJoke?.name} Permalink</Link>
		</div>
	);
}
