import { createCookieSessionStorage } from "@remix-run/node";

export const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
	throw new Error("No session secret. Pls set it.");
}

interface SessionData {
	userId: string;
}

interface SessionFlasData {
	error: string;
}

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "__session",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			path: "/",
			sameSite: "lax",
			secrets: [sessionSecret],
			secure: process.env.NODE_ENV === "production",
		},
	});

export { getSession, commitSession, destroySession };
