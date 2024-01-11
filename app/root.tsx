import { Links, LiveReload, Outlet } from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import globalStyles from "./styles/global.css";
import globalMedium from "./styles/global-medium.css";
import globalLarge from "./styles/global-large.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: globalStyles },
	{
		rel: "stylesheet",
		href: globalMedium,
		media: "print, (min-width: 640px)",
	},
	{
		rel: "stylesheet",
		href: globalLarge,
		media: "screen and (min-width: 1024px)",
	},
];

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<title>Remix: So great, it's funny!</title>
				<Links />
			</head>
			<body>
				<Outlet />
				<LiveReload />
			</body>
		</html>
	);
}
