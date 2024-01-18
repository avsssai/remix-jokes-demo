import bcrypt from "bcryptjs";
import { db } from "./db.server";
import { commitSession, getSession } from "./sessions";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

type LoginForm = {
	username: string;
	password: string;
};

export const login = async ({ username, password }: LoginForm) => {
	const user = await db.user.findUnique({ where: { username } });
	if (!user) {
		return null;
	}
	const legitLogin = await bcrypt.compare(password, user.passwordHash);
	if (!legitLogin) {
		return null;
	}
	return { id: user.id, username };
};

export const createUserSession = async (userId: string, redirectTo: string) => {
	const session = await getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export const getUserSession = async (request: Request) => {
	return getSession(request.headers.get("Cookie"));
};

export const getUserId = async (request: Request): Promise<string | null> => {
	const session = await getUserSession(request);
	const userId = session.get("userId");
	if (!userId || typeof userId !== "string") {
		return null;
	}
	return userId;
};

export const requireUserId = async (
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) => {
	const session = await getUserSession(request);
	const userId = session.get("userId");
	if (!userId || typeof userId !== "string") {
		const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
		throw redirect(`/login?${searchParams}`);
	}
	return userId;
};
