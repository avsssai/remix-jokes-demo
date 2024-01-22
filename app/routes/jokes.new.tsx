import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/node";
import {
    Form,
    Link,
    isRouteErrorResponse,
    useActionData,
    useRouteError,
} from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { getUserId, requireUserId } from "~/utils/session.server";

function validateJokeContent(content: string) {
    if (content.length < 3) {
        return "That joke's is too short.";
    }
}

function validateJokeName(name: string) {
    if (name.length < 10) {
        return "The joke's name is too short.";
    }
}

interface Fields {
    name?: string;
    content?: string;
}
interface Errors {
    fieldErrors: Fields | null;
    fields: Fields | null;
    formError: string | null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // get the user id from the request
    const userId = await getUserId(request);
    if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
    }
    return json({});
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const userId = await requireUserId(request);
    const name = formData.get("name");
    const content = formData.get("content");
    if (typeof name !== "string" || typeof content !== "string") {
        return badRequest<Errors>({
            fieldErrors: null,
            fields: null,
            formError: "Form not submitted correctly",
        });
    }
    const fieldErrors = {
        name: validateJokeName(name),
        content: validateJokeContent(content),
    };
    const fields = { name, content };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest<Errors>({ fieldErrors, fields, formError: null });
    }
    const joke = await db.joke.create({
        data: { ...fields, jokesterId: userId },
    });
    return redirect(`/jokes/${joke.id}`);
};

export default function NewJoke() {
    const data = useActionData<typeof action>();
    console.log(data);
    return (
        <div>
            <p>Add your own hilarious joke.</p>
            <Form method="post">
                <div>
                    <label>
                        Name:{" "}
                        <input
                            name="name"
                            defaultValue={data?.fields?.name}
                            aria-invalid={Boolean(data?.fieldErrors?.name)}
                            type="text"
                            aria-errormessage={
                                data?.fieldErrors?.name
                                    ? "name-error"
                                    : undefined
                            }
                        />
                    </label>
                    {data?.fieldErrors?.name ? (
                        <p
                            className="form-validation-error"
                            id="name-error"
                            role="alert"
                        >
                            {data.fieldErrors.name}
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <div>
                    <label htmlFor="content">
                        Content:{" "}
                        <textarea
                            name="content"
                            defaultValue={data?.fields?.content}
                            aria-invalid={Boolean(data?.fieldErrors?.content)}
                            aria-errormessage={
                                data?.fieldErrors?.content
                                    ? "content-error"
                                    : undefined
                            }
                        />
                    </label>
                    {data?.fieldErrors?.content ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                            id="name-error"
                        >
                            {data.fieldErrors.content}
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <div>
                    <button type="submit" className="button">
                        Add
                    </button>
                </div>
            </Form>
        </div>
    );
}

export const ErrorBoundary = () => {
    // catch the response thrown by the loader and render the error with a 401 message if the user
    // is not logged in
    const error = useRouteError();
    if (isRouteErrorResponse(error) && error.status === 401) {
        return (
            <div className="error-container">
                <p>You need to logged in to create a new joke.</p>
                <Link to={"/login"}>Login here</Link>
            </div>
        );
    }
    return (
        <div className="error-container">
            There was an error creating a new joke, pls try again.
        </div>
    );
};
