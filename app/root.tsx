import {
    Links,
    LiveReload,
    Outlet,
    isRouteErrorResponse,
    useRouteError,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
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

export const Document = ({
    children,
    title = "Remix: So great, it's funny!",
}: PropsWithChildren<{ title?: string }>) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>{title}</title>
                <Links />
            </head>
            <body>
                {children}
                <LiveReload />
            </body>
        </html>
    );
};

export default function App() {
    return (
        <Document>
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
    return (
        <Document title="Uh-oh!">
            <div className="error-container">
                <h1>App error</h1>
                {errorMessage}
            </div>
        </Document>
    );
};
