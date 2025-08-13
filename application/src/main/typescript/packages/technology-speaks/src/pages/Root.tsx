import "./Root.css"

import React, {useContext, useEffect, useState} from "react"
import {Drawer, Link, Router, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity";
import Application from "../domain/Application";
import {SystemContext} from "react-ui-simplicity/src/System";
import navigate = Router.navigate;
import onLink = Link.onLink;
import Cookies from "js-cookie";

export function process(response: Response) {
    if (response.status === 403) {
        if (location.search.indexOf("redirect") === -1) {
            navigate(`/security/login?redirect=${response.url}}`)
        }
    }
}

function Root(properties: AppContent.Attributes) {

    const {application} = properties

    const {info} = useContext(SystemContext)

    const mediaQuery = useMatchMedia("(max-width: 1440px)")

    const [open, setOpen] = useState(info.cookie["drawer"] === "open")

    const onLinkClick = () => {
        if (! mediaQuery) {
            setOpen(false)
            Cookies.set("drawer", "close")
        } else {
            setOpen(true)
            Cookies.set("drawer", "open")
        }
    }

    useEffect(() => {
        setOpen(info.cookie["drawer"] === "open")
    }, []);

    function onDrawerClick(event : React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setOpen(!open)
        if (open) {
            Cookies.set("drawer", "close")
        } else {
            Cookies.set("drawer", "open")
        }
    }

    return (
        <div className={"app"}>
            <ToolBar>
                <div slot="left">
                    <form action="/toggle-drawer" method="POST" onSubmit={onDrawerClick}>
                        <input type="hidden" name="drawer" value={info.cookie["drawer"] === "open" ? "close" : "open"}/>
                        <button type="submit" className={"material-icons hover"}>menu</button>
                    </form>
                </div>
                <div slot={"right"}>
                    <div style={{display: "flex", gap: "5px", justifyContent: "flex-end", alignItems: "center"}}>
                        {
                            onLink(application.$links, "login", (link) => (
                                <Link value={link.url} icon={"login"}/>
                            ))
                        }
                        {
                            onLink(application.$links, "register", (link) => (
                                <Link value={link.url} icon={"app_registration"}/>
                            ))
                        }

                        {
                            onLink(application.$links, "profile", (link) => (
                                <Link value={link.url}>
                                    {application.user.nickName}
                                </Link>
                            ))
                        }

                        {
                            onLink(application.$links, "logout", (link) => (
                                <Link value={link.url} icon={"logout"}/>
                            ))
                        }
                    </div>
                </div>
            </ToolBar>
            <Drawer.Container>
                <Drawer open={open}>
                    <div style={{padding: "24px"}}>
                        <ul>
                            {
                                onLink(application.$links, "login", (link) => (
                                    <li>
                                        <Link key={link.url} value={link.url} icon={"login"}>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                onLink(application.$links, "register", (link) => (
                                    <li>
                                        <Link key={link.url} value={link.url} icon={"app_registration"}>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                onLink(application.$links, "chat", (link) => (
                                    <li>
                                        <Link key={link.url} value={link.url} icon={"chat"}>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                onLink(application.$links, "documents", (link) => (
                                    <li>
                                        <Link key={link.url} value={link.url} icon={"menu_book"}>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                onLink(application.$links, "translations", (link) => (
                                    <li>
                                        <Link key={link.url} value={link.url} icon={"language_international"}>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                onLink(application.$links, "users", (link) => (
                                    <li>
                                        <Link key={link.url} value={link.url} icon={"groups"}>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </Drawer>
                <Drawer.Content onClick={onLinkClick}>
                    <Viewport>
                        <Router/>
                    </Viewport>
                </Drawer.Content>
            </Drawer.Container>
        </div>
    )
}

namespace AppContent {
    export interface Attributes {
        application: Application
    }
}

export default Root