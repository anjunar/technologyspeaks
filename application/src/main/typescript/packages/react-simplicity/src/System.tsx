import "./System.css"
import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState} from "react";
import {init} from "./domain/Persistence";
import Router from "./components/navigation/router/Router";
import Input from "./components/inputs/input/Input";
import ToolBar from "./components/layout/toolbar/ToolBar";
import Progress from "./components/indicators/progress/Progress";
import Cookies from 'js-cookie';
import {RequestInformation} from "technology-speaks/src/request";

init()

export class WindowRef {

    name: string

    constructor(name: string) {
        this.name = name;
    }
}

export class SystemContextHolder {

    constructor(public depth : number = 0,
                public routes: Router.Route[] = [],
                public windows: [WindowRef[], Dispatch<SetStateAction<WindowRef[]>>] = null,
                public data : [Router.Route, React.ReactElement][] = [],
                public info : RequestInformation = null) {
    }

}

export const SystemContext = createContext(new SystemContextHolder())

function System(properties : System.Attributes) {

    const {depth, routes, data, info} = properties

    const [loading, setLoading] = useState([])

    const [windows, setWindows] = useState<WindowRef[]>([])

    const [darkMode, setDarkMode] = useState(info.cookie["theme"] === "dark")

    function onDarkModeClick(event : React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setDarkMode(!darkMode)
    }

    useLayoutEffect(() => {
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e: MediaQueryListEvent) => {
            const newIsDark = e.matches;
            setDarkMode(newIsDark);
        };

        matchMedia.addEventListener('change', handler);

        return () => {
            matchMedia.removeEventListener('change', handler);
        };
    }, []);

    useLayoutEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute("data-theme", "dark")
            Cookies.set('theme', 'dark', { expires: 365, path: '/' });
        } else {
            document.documentElement.setAttribute("data-theme", "light")
            Cookies.set('theme', 'light', { expires: 365, path: '/' });
        }
    }, [darkMode]);

    useLayoutEffect(() => {

        window.fetch = new Proxy(window.fetch, {
            apply(target: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>, thisArg: any, argArray: any[]): any {

                const maxRetries = 10;
                const delayMs = 1000;

                const fetchWithRetry = async (attempt = 1): Promise<Response> => {
                    try {
                        setLoading(prev => [...prev, argArray]);

                        const response = await Reflect.apply(target, thisArg, argArray);

                        setTimeout(() => {
                            setLoading(prev => {
                                const indexOf = prev.indexOf(argArray);
                                if (indexOf > -1) prev.splice(indexOf, 1);
                                return [...prev];
                            });
                        }, delayMs);


                        return response;

                    } catch (error: any) {
                        if (error.name === "TimeoutError") {
                            setLoading([]);
                            Router.navigate("/errors/timeout");
                            throw error;
                        }

                        if (attempt < maxRetries) {
                            console.warn(`fetch attempt ${attempt} failed, retrying...`, error);
                            await new Promise(resolve => setTimeout(resolve, delayMs));
                            return fetchWithRetry(attempt + 1);
                        } else {
                            throw error;
                        }
                    }
                };

                return fetchWithRetry();
            }
        });

    }, []);

    useEffect(() => {
        document.documentElement.classList.remove("loading");
    }, []);

    return (
        <div className={"system"}>
            <SystemContext.Provider value={new SystemContextHolder(depth, routes, [windows, setWindows], data, info)}>
                <div style={{position: "absolute", zIndex: 9999, top: 0, left: 0, height: "4px", width: "100%"}}>
                    {
                        loading.length > 0 && <Progress/>
                    }
                </div>
                <Router onRoute={() => {}}/>
                <ToolBar>
                    <div slot={"left"}>
                        <div style={{display: "flex"}} onClick={(event) => event.stopPropagation()}>
                            {
                                windows.map((window, index) => (
                                    <div key={index}
                                         style={{backgroundColor: "var(--color-background-tertiary)"}}>{window.name}</div>
                                ))
                            }
                        </div>
                    </div>
                    <div slot={"right"}>
                        <div style={{display : "flex", alignItems : "center", gap : "5px", justifyContent : "flex-end"}}>
                            <form action="/toggle-theme" method="POST" onSubmit={onDarkModeClick}>
                                <input type="hidden" name="theme" value={info.cookie["theme"] === "dark" ? "light" : "dark"}/>
                                <button type="submit" className={"material-icons"}>{info.cookie["theme"] === "dark" ? "light_mode" : "dark_mode"}</button>
                            </form>
                        </div>
                    </div>
                </ToolBar>
            </SystemContext.Provider>
        </div>
    )
}

namespace System {
    export interface Attributes {
        depth : number
        routes : Router.Route[]
        data : [Router.Route, React.ReactElement][]
        info : RequestInformation
    }
}

export default System