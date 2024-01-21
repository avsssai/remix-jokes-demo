import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
    Link,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async (params: LoaderFunctionArgs) => {
    // throw an error if we are not able to display jokes
    const count = await db.joke.count();
    const random = Math.floor(Math.random() * count);
    const [randomJoke] = await db.joke.findMany({
        skip: random,
        take: 1,
    });
    if (!randomJoke) {
        throw new Response("No random jokes found", { status: 404 });
    }
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

export const ErrorBoundary = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <div className="error-container">
                <p>No random joke found.</p>
                <Link to={`new`}>Add your own</Link>
            </div>
        );
    }
    return (
        <div className="error-container">
            Something went wrong, Problem displaying jokes. Pls try reloading
            the page.
        </div>
    );
};
