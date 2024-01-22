import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import stylesUrl from "../styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
    { href: stylesUrl, rel: "stylesheet" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    try {
        const jokes = await db.joke.findMany({
            orderBy: { createdAt: "desc" },
            select: { name: true, id: true },
            take: 5,
        });
        console.log(jokes);
        const user = await getUser(request);
        return json({ jokeListItems: jokes, user });
    } catch (error) {
        throw new Response("Not found", { status: 404 });
    }
};

export default function Jokes() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="jokes-layout">
            <header className="jokes-header">
                <div className="container">
                    <h1 className="home-link">
                        <Link
                            to="/"
                            title="Remix Jokes"
                            aria-label="Remix Jokes"
                        >
                            <span className="logo">🤪</span>
                            <span className="logo-medium">J🤪KES</span>
                        </Link>
                    </h1>
                    {data.user ? (
                        <div className="user-info">
                            <span>{`Hi ${data.user.username}`}</span>
                            <form method="post" action="/logout">
                                <button className="button" type="submit">
                                    Logout
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link to={"/login"}>Login</Link>
                    )}
                </div>
            </header>
            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        <Link to=".">Get a random joke</Link>
                        <p>Here are a few more jokes to check out:</p>
                        <ul>
                            {data.jokeListItems.map(({ id, name }) => (
                                <li key={id}>
                                    <Link to={id} prefetch="intent">
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="new" className="button">
                            Add your own
                        </Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
