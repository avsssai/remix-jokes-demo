import {
    Links,
    LiveReload,
    Outlet,
    isRouteErrorResponse,
    useRouteError,
    Meta,
    Scripts,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import globalStyles from "./styles/global.css";
import globalMedium from "./styles/global-medium.css";
import globalLarge from "./styles/global-large.css";
import { PropsWithChildren } from "react";

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

export const meta: MetaFunction = () => {
    const description = "Learn Remix and laugh at the same time";
    return [
        { name: "description", content: description },
        { name: "twitter:description", content: description },
        { title: "Remix: So great, it's funny!" },
    ];
};

export const Document = ({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="keywords" content="Remix,jokes" />
                <meta
                    name="twitter:image"
                    content="https://remix-jokes.lol/social.png"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:creator" content="@remix_run" />
                <meta name="twitter:site" content="@remix_run" />
                <meta name="twitter:title" content="Remix Jokes" />
                <Meta />
                {title ? <title>{title}</title> : null}
                <Links />
            </head>
            <body>
                {children}
                <LiveReload />
                <Scripts />
            </body>
        </html>
    );
};

export default function App() {
    return (
        <Document title="Joke">
            <Outlet />
        </Document>
    );
}

export const ErrorBoundary = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <Document title={`${error.status} ${error.statusText}`}>
                <div className="error-container">
                    <h1>
                        {error.status} {error.statusText}
                    </h1>
                </div>
            </Document>
        );
    }
    const errorMessage =
        error instanceof Error ? error.message : "Unknown Error message";
    console.error(error);
    return (
        <Document title="Uh-oh!">
            <div className="error-container">
                <h1>App error</h1>
                {errorMessage}
            </div>
        </Document>
    );
};
