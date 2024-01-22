import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
    Link,
    isRouteErrorResponse,
    useLoaderData,
    useParams,
    useRouteError,
} from "@remix-run/react";
import { db } from "~/utils/db.server";
import invariant from "tiny-invariant";
import { getUser } from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const { description, title } = data
        ? {
              description: `Enjoy the "${data.singleJoke.name}" joke and much more.`,
              title: `"${data.singleJoke.name} joke"`,
          }
        : {
              description: "No joke found",
              title: "No joke.",
          };
    return [
        { name: "description", content: description },
        { name: "twitter:description", content: description },
        { name: "title", content: title },
    ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const { jokeId } = params;
    const user = await getUser(request);
    invariant(params.jokeId, "Joke Id missing from params.");
    const joke = await db.joke.findUnique({
        where: {
            id: jokeId,
        },
    });
    if (!joke) {
        throw new Response("What a joke! Not found.", { status: 404 });
    }
    return json({ singleJoke: joke, user });
};

export default function SingleJoke() {
    const { singleJoke, user } = useLoaderData<typeof loader>();
    return (
        <div>
            <p>{singleJoke?.name}</p>
            <p>{singleJoke?.content}</p>
            <Link to={`.`}>{singleJoke?.name} Permalink</Link>
            {user?.id === singleJoke.jokesterId ? (
                <form action={`/jokes/${singleJoke.id}/destroy`} method="post">
                    <button
                        name="intent"
                        value="delete"
                        type="submit"
                        className="button"
                    >
                        Delete
                    </button>
                </form>
            ) : (
                ""
            )}
        </div>
    );
}

export const ErrorBoundary = () => {
    const error = useRouteError();
    const { jokeId } = useParams();
    if (isRouteErrorResponse(error) && error.status === 404) {
        return (
            <div className="error-container">
                <h1>
                    {error.status} What the heck is "{jokeId}"
                </h1>
            </div>
        );
    }
    return (
        <div className="error-container">
            There was an error displaying the joke with joke Id {jokeId}, Pls
            try again.
        </div>
    );
};
