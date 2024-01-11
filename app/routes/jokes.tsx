import { Outlet } from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import stylesUrl from "../styles/jokes.css";

export const links: LinksFunction = () => [
	{ href: stylesUrl, rel: "stylesheet" },
];

export default function Jokes() {
	return (
		<div>
			<h1>J🤪KES</h1>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
