import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const action = async ({request}:ActionFunctionArgs) => {
    return await logout(request)
}

export const loader =async () => {
    return redirect("/login")
}