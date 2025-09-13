import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {App} from './App';
import {
    resolveComponentList, resolveRoute,
} from "shared";
import {routes} from "./routes";
import {RequestInformation} from "./request";

function resolvePreferredLanguage(header: string): string {
    if (!header) return "en";

    const languages = header
        .split(",")
        .map(part => {
            const [lang, q] = part.trim().split(";q=");
            return { lang, q: parseFloat(q || "1") };
        })
        .sort((a, b) => b.q - a.q);

    return languages[0]?.lang?.split("-")[0] || "en";
}

function parseCookieString(cookieString) {
    return cookieString
        .split("; ")
        .map(cookie => cookie.split("="))
        .reduce((acc, [key, value]) => {
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
}

const info : RequestInformation = {
    protocol : window.location.protocol.replace(":", ""),
    path : window.location.pathname,
    search : window.location.search,
    cookie : parseCookieString(document.cookie) || {},
    host : window.location.host,
    language : resolvePreferredLanguage(window.navigator.language)
}


async function main() {
    const resolved = resolveRoute(info, routes);

    const components = await resolveComponentList(resolved, info)

    hydrateRoot(document.getElementById('root'), (
        <App info={info}
             data={components}
        />
    ),  {
        onUncaughtError: (error, errorInfo) => {
            console.error(errorInfo.componentStack)
        },
        onRecoverableError: (error, errorInfo) => {
            console.warn(errorInfo.componentStack)
        },
        onCaughtError: (error, errorInfo) => {
            console.error(errorInfo.componentStack)
        }
    })
}

main().catch(console.error)