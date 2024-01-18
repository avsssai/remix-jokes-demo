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
