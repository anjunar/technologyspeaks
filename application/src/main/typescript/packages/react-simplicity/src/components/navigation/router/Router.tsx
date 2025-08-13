import "./Router.css"
import React, {FunctionComponent, useContext, useEffect, useRef, useState} from "react"
import {SystemContext, SystemContextHolder} from "../../../System"
import {match} from "path-to-regexp"
import {useHydrated} from "../../../hooks";
import Route = Router.Route;
import QueryParams = Router.QueryParams;
import PathParams = Router.PathParams;
import {RequestInformation} from "technology-speaks/src/request";

const scrollAreaCache = new Map<string, number>()

const routeCache = new Map<string, React.ReactElement<any>>()

export async function resolveComponentList(
    [route, queryParams, pathParams, component] : [Route, QueryParams, PathParams, FunctionComponent<any>],
    info : RequestInformation,
    findFirst = false
): Promise<[Route, React.ReactElement][]> {
    if (route === null) {
        return [];
    }

    const props : Record<string, any> = {queryParams, pathParams};

    if (route.loader) {
        const loaderEntries = Object.entries(route.loader);
        const loaded = await Promise.all(
            loaderEntries.map(([_, fn]) => {
                return fn(info, pathParams, queryParams)
                    .catch(e => {
                        if (typeof window === "undefined") {
                            throw e;
                        } else {
                            if (e instanceof Router.RedirectError) {
                                Router.navigate(e.url)
                                return null;
                            }
                        }
                    })
            })
        );
        loaderEntries.forEach(([key], i) => {
            props[key] = loaded[i];
        });
    }

    const element = React.createElement(component as FunctionComponent<any>, props);

    const childElements = !findFirst && route.children
        ? await resolveComponentList(resolveRoute(info, route.children), info, findFirst)
        : [];
    return [[route, element], ...childElements];
}

export function resolveRoute(
    info : RequestInformation,
    routes: Route[],
): [Route, QueryParams, PathParams, FunctionComponent<any>] {
    const queryParams = resolveQueryParameters(info.search);

    const flattened = flattenRoutes(routes);

    for (const [rawPath, route] of flattened) {
        let pathParams: PathParams;

        if (route.subRouter && info.path.startsWith(rawPath)) {
            pathParams = {};
        } else {
            const matcher = match(rawPath, { decode: decodeURIComponent });
            const matched = matcher(info.path);
            if (!matched) continue;
            pathParams = matched.params as PathParams;
        }

        const component = route.component ?? (route.dynamic?.(pathParams, queryParams));

        return [route, queryParams, pathParams, component]
    }

    return [null, null, null, null]
}

function flattenRoutes(routes: Route[], parentPath: string = ''): Router.RouteWithPath[] {
    return routes.reduce((previous: Router.RouteWithPath[], current: Route) => {
        const currentPath = `${parentPath}${current.path}`.replace(/\/\//g, '/')
        const currentRouteWithPath: Router.RouteWithPath = [currentPath, current]
        const childrenRoutes = current.children
            ? flattenRoutes(current.children, currentPath)
            : []
        return [...previous, currentRouteWithPath, ...childrenRoutes]
    }, [])
}

function resolveQueryParameters(search: string): QueryParams {
    let segments = search
        .slice(1)
        .split("&")
        .filter(str => str.length > 0)
    return segments.reduce((prev: any, current) => {
        let split = current.split("=")
        let element = prev[split[0]]
        if (element) {
            if (element instanceof Array) {
                element.push(split[1])
                return prev
            } else {
                prev[split[0]] = [element, split[1]]
                return prev
            }
        } else {
            prev[split[0]] = split[1]
            return prev
        }
    }, {})
}

function Router(properties: Router.Attributes) {

    const {onRoute, ...rest} = properties

    const {
        depth,
        routes,
        windows,
        data,
        info
    } = useContext(SystemContext)

    const hydrated = useHydrated()

    const [state, setState] = useState<React.ReactElement<any>>(() => {
        return data[depth][1]
    })

    const [childRoutes, setChildRoutes] = useState<Route[]>(data[depth][0].children)

    const scrollArea = useRef<HTMLDivElement>(null)

    async function processUrlChange() {
        if (onRoute) onRoute(true);

        try {
            const [route, queryParams, pathParams, component] = resolveRoute(info, routes);

            const key = JSON.stringify([route, queryParams, pathParams])
            /*

                        if (routeCache.has(key)) {
                            setState(routeCache.get(key));
                            setChildRoutes(route.children);
                            return;
                        }
            */

            const [components] = await resolveComponentList([route, queryParams, pathParams, component], info, true);
            const [_, element] = components
            setState(element);
            setChildRoutes(route.children);
            routeCache.set(key, element);

        } catch (error) {
            console.error("Fehler beim Laden der Komponenten", error);
            setState(null);
            setChildRoutes([]);
        }

        if (onRoute) onRoute(false);
    }

    useEffect(() => {
        if (hydrated) {
            processUrlChange()
        }
    }, [info.path, info.search])

    useEffect(() => {
        let scrollTop = scrollAreaCache.get(window.location.href)
        if (scrollTop) {
            scrollArea.current.scrollTop = scrollTop
        }
    }, [state])

    useEffect(() => {
        let listener = () => {
            scrollAreaCache.set(window.location.href, scrollArea.current.scrollTop)
        }

        scrollArea.current.addEventListener("scroll", listener)

        return () => {
            scrollArea.current?.removeEventListener("scroll", listener)
        }
    }, [])

    function getContextHolder() {
        return new SystemContextHolder(depth + 1, childRoutes, windows, data, info)
    }

    return (
        <div ref={scrollArea} className={"router"} {...rest}>
            <SystemContext.Provider value={getContextHolder()}>
                {state}
            </SystemContext.Provider>
        </div>
    )
}

namespace Router {
    export type RouteWithPath = [string, Route]

    export interface Attributes {
        onRoute?: (loading: boolean) => void
    }

    export function navigate(url: string, data?: any) {
        try {
            const path = new URL("http://" + url, window.location.origin);
            window.history.pushState(data, "", path)
            window.dispatchEvent(new PopStateEvent("popstate", {state: data}))
        } catch (e) {
            window.history.pushState(data, "", url)
            window.dispatchEvent(new PopStateEvent("popstate", {state: data}))
        }
    }

    export interface PathParams {
        [key: string]: string
    }

    export interface QueryParams {
        [key: string]: string | string[]
    }

    export interface Loader {
        [key: string]: (info : RequestInformation, pathParams: PathParams, queryParams: QueryParams) => Promise<any>
    }

    export interface Route {
        path: string
        subRouter?: boolean
        component?: FunctionComponent<any>
        dynamic?: (path: PathParams, query: QueryParams) => FunctionComponent<any>
        children?: Route[]
        loader?: Loader
    }

    export class RedirectError extends Error {
        constructor(public url: string) {
            super("Redirect Error to:" + url)
        }
    }
}

export default Router
