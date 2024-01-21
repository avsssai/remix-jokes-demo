import { redirect } from "@remix-run/node";
import { LoaderFunctionArgs } from "react-router";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    // if the user isnt there, return a 403
    const user = await getUserId(request);
    const { jokeId } = params;
    const joke = await db.joke.findUnique({
        where: {
            id: jokeId,
        },
    });
    if (!joke) {
        throw new Response("That joke doesn't exist. Not Found.", {
            status: 404,
        });
    }
    if (!user || user !== joke?.jokesterId) {
        throw new Response("Unauthorized.", {
            status: 403,
        });
    }
    await db.joke.delete({
        where: {
            id: jokeId,
        },
    });
    return redirect("/jokes");
};
