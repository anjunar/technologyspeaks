import './App.css';
import React, {useEffect, useState} from 'react';
import {Router, System} from "shared";
import {init} from "./Persistence"
import {routes} from "./routes";
import {RequestInformation} from "./request";

init()

export function App(properties : App.Attributes) {
    const {data, info} = properties
    const [path, setPath] = useState(info.path);
    const [search, setSearch] = useState(info.search);

    useEffect(() => {
        const onPopState = () => {
            setPath(window.location.pathname);
            setSearch(window.location.search);
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return <System depth={0}
                   routes={routes}
                   data={data}
                   info={{
                       protocol : info.protocol,
                       path : path,
                       search : search,
                       cookie : info.cookie,
                       host : info.host,
                       language : info.language,
                   }}
    />;
}

namespace App {
    export interface Attributes {
        data : [Router.Route, React.ReactElement][]
        info : RequestInformation
    }
}