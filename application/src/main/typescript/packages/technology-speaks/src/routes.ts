import {mapForm, mapTable, Router} from "react-ui-simplicity";
import Root from "./pages/Root";
import FormPage from "./pages/navigator/FormPage";
import TablePage from "./pages/navigator/TablePage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/security/LoginPage";
import RegisterPage from "./pages/security/RegisterPage";
import ConfirmationPage from "./pages/security/ConfirmationPage";
import {UAParser} from "ua-parser-js";
import Login from "./domain/security/Login";
import LogoutPage from "./pages/security/LogoutPage";
import DocumentSearchPage from "./pages/documents/search/DocumentSearchPage";
import DocumentFormPage from "./pages/documents/document/DocumentFormPage";
import DocumentViewPage from "./pages/documents/document/DocumentViewPage";
import RevisionsTablePage from "./pages/documents/document/revisisions/RevisionsTablePage";
import DocumentSearch from "./domain/document/DocumentSearch";
import I18nTablePage from "./pages/shared/i18n/I18nTablePage";
import I18nFormPage from "./pages/shared/i18n/I18nFormPage";
import QueryParams = Router.QueryParams;
import PathParams = Router.PathParams;
import {RequestInformation} from "./request";
import ChatPage from "./pages/chat/ChatPage";
import UserSearchPage from "./pages/control/users/search/UserSearchPage";
import UserFormPage from "./pages/control/users/user/UserFormPage";
import SecuredPropertyForm from "./components/security/SecuredPropertyForm";

export function process(response: Response, redirect : string) {
    if (response.status === 403) {
        throw new Router.RedirectError(`/security/login?redirect=${encodeURIComponent(redirect)}`)
    }
}

function getHeaders(info : RequestInformation) {
    return {
        cookie: `JSESSIONID=${info.cookie["JSESSIONID"]}`,
        "accept-language": info.language
    };
}

function getRedirect(info) {
    return `${info.path}${info.search.length === 1 ? "" : info.search}`;
}

export const routes: Router.Route[] = [
    {
        path: "/",
        subRouter: true,
        component: Root,
        loader: {
            async application(info, pathParams, queryParams) {
                let response = await fetch(`${info.protocol}://${info.host}/service`, {
                    headers : getHeaders(info)
                })

                process(response, getRedirect(info))

                if (response.ok) {
                    return mapForm(await response.json(), false)
                }

                throw new Error(response.status.toString())
            }
        },
        children: [
            {
                path: "/",
                component: HomePage,
                loader: {
                    async search(info, pathParams, queryParams) {
                        let response = await fetch(`${info.protocol}://${info.host}/service/documents/search`, {
                            headers : getHeaders(info)
                        })

                        process(response, getRedirect(info))

                        if (response.ok) {
                            return mapForm(await response.json(), true)
                        }

                        throw new Error(response.status.toString())
                    }
                }
            },
            {
                path : "/control",
                children : [
                    {
                        path : "/users",
                        children: [
                            {
                                path : "/search",
                                component : UserSearchPage,
                                loader: {
                                    async users(info, pathParams, queryParams) {
                                        let response = await fetch(`${info.protocol}://${info.host}/service/control/users?index=0&limit=5`, {
                                            headers : getHeaders(info)
                                        })

                                        process(response, getRedirect(info))

                                        if (response.ok) {
                                            return mapTable(await response.json())
                                        }

                                        throw new Error(response.status.toString())
                                    }
                                }
                            },
                            {
                                path : "/user/:id",
                                component : UserFormPage,
                                loader: {
                                    async form(info, pathParams, queryParams) {
                                        let response = await fetch(`${info.protocol}://${info.host}/service/control/users/user/${pathParams["id"]}`, {
                                            headers : getHeaders(info)
                                        })

                                        process(response, getRedirect(info))

                                        if (response.ok) {
                                            return mapForm(await response.json(), true)
                                        }

                                        throw new Error(response.status.toString())
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: "/chat",
                component : ChatPage
            },
            {
                path: "/documents",
                children: [
                    {
                        path: "/search",
                        component: DocumentSearchPage,
                        loader: {
                            async table(info, pathParams : PathParams, queryParams : QueryParams) {
                                const urlBuilder = new URL("/service/documents", `${info.protocol}://${info.host}`)
                                const searchParams = urlBuilder.searchParams;

                                searchParams.set("index", queryParams["index"] as string || "0")
                                searchParams.set("limit", queryParams["limit"] as string || "0")

                                if (queryParams.text) {
                                    searchParams.set("text", queryParams.text as string)
                                    searchParams.set("sort", "score:asc")
                                }

                                let response = await fetch(urlBuilder.toString(), {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapTable(await response.json(), true)
                                }

                                throw new Error(response.status.toString())
                            },
                            async search(info, pathParams, queryParams) {
                                let response = await fetch(`${info.protocol}://${info.host}/service/documents/search`, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    let form = mapForm<DocumentSearch>(await response.json(), true);
                                    form.text = decodeURIComponent(queryParams["text"] as string || "")
                                    return form
                                }

                                throw new Error(response.status.toString())
                            }
                        }
                    },
                    {
                        path: "/document",
                        component : DocumentFormPage,
                        loader: {
                            async form(info, pathParams, queryParams) {
                                let response = await fetch(`${info.protocol}://${info.host}/service/documents/document`, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())
                            }
                        }
                    },
                    {
                        path: "/document/:id",
                        dynamic: (path, query) => {
                            if (query["edit"] === "true") {
                                return DocumentFormPage
                            } else {
                                return DocumentViewPage
                            }
                        },
                        loader: {
                            async form(info, pathParams, queryParams) {
                                let response = await fetch(`${info.protocol}://${info.host}/service/documents/document/${pathParams.id}?edit=${queryParams["edit"]}`, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())
                            }
                        },
                        children: [
                            {
                                path: "/revisions",
                                children: [
                                    {
                                        path: "/search",
                                        component: RevisionsTablePage
                                    },
                                    {
                                        path: "/revision/:rev/view",
                                        component: DocumentViewPage,
                                        loader: {
                                            async form(info, pathParams, queryParams) {
                                                let response = await fetch(`${info.protocol}://${info.host}/service/documents/document/${pathParams.id}/revisions/revision/${pathParams.rev}/view`, {
                                                    headers : getHeaders(info)
                                                })

                                                process(response, getRedirect(info))

                                                if (response.ok) {
                                                    return mapForm(await response.json(), true)
                                                }

                                                throw new Error(response.status.toString())
                                            }
                                        }
                                    }, {
                                        path: "/revision/:rev/compare",
                                        component: DocumentViewPage,
                                        loader: {
                                            async form(info, pathParams, queryParams) {
                                                let response = await fetch(`${info.protocol}://${info.host}/service/documents/document/${pathParams.id}/revisions/revision/${pathParams.rev}/compare`, {
                                                    headers : getHeaders(info)
                                                })

                                                process(response, getRedirect(info))

                                                if (response.ok) {
                                                    return mapForm(await response.json(), true)
                                                }

                                                throw new Error(response.status.toString())
                                            }
                                        }
                                    }]
                            }
                        ]
                    }
                ]
            },
            {
                path: "/security",
                children: [
                    {
                        path: "/properties/property/:id",
                        component : SecuredPropertyForm,
                        loader: {
                            async form(info, pathParams, queryParams) {
                                let response = await fetch(`${info.protocol}://${info.host}/service/security/properties/property/${pathParams["id"]}`, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())
                            }
                        }
                    },
                    {
                        path: "/login",
                        component: LoginPage
                    },
                    {
                        path: "/register",
                        component: RegisterPage
                    },
                    {
                        path: "/confirm",
                        component: ConfirmationPage,
                        loader: {
                            async form(info, pathParams, queryParams) {
                                let response = await fetch(`${info.protocol}://${info.host}/service/security/confirm`, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())
                            }
                        }
                    },
                    {
                        path: "/logout",
                        component: LogoutPage,
                        loader: {
                            async credential(info, pathParams, queryParams) {
                                let response = await fetch(`${info.protocol}://${info.host}/service/security/logout`, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())
                            }
                        }
                    }
                ]
            },
            {
                path : "/shared",
                children : [
                    {
                        path: "/i18ns",
                        children: [
                            {
                                path : "/search",
                                component : I18nTablePage,
                                loader : {
                                    async table(info, pathParams : PathParams, queryParams : QueryParams) {
                                        let response = await fetch(`${info.protocol}://${info.host}/service/shared/i18ns?index=${queryParams["index"] || 0}&limit=10`, {
                                            headers : getHeaders(info)
                                        })

                                        process(response, getRedirect(info))

                                        if (response.ok) {
                                            return mapTable(await response.json(), true)
                                        }

                                        throw new Error(response.status.toString())
                                    },
                                    async search(info, pathParams : PathParams, queryParams : QueryParams) {
                                        let response = await fetch(`${info.protocol}://${info.host}/service/shared/i18ns/search`, {
                                            headers : getHeaders(info)
                                        })

                                        process(response, getRedirect(info))

                                        if (response.ok) {
                                            return mapForm(await response.json(), true)
                                        }

                                        throw new Error(response.status.toString())
                                    }
                                }
                            },
                            {
                                path : "/i18n/:id",
                                component : I18nFormPage,
                                loader : {
                                    async form(info, pathParams : PathParams, queryParams : QueryParams) {
                                        let response = await fetch(`${info.protocol}://${info.host}/service/shared/i18ns/i18n/${pathParams["id"]}`, {
                                            headers : getHeaders(info)
                                        })

                                        process(response, getRedirect(info))

                                        if (response.ok) {
                                            return mapForm(await response.json(), true)
                                        }

                                        throw new Error(response.status.toString())
                                    }
                                }
                            }
                        ]

                    }
                ]
            },
            {
                path: "/navigator",
                children: [
                    {
                        path: "/form",
                        component: FormPage,
                        loader: {
                            async form(info, query) {
                                let element = query["link"]

                                let link
                                if (element) {
                                    link = atob(element as string)
                                } else {
                                    link = ""
                                }

                                let response = await fetch(`${info.protocol}://${info.host}/service` + link, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())

                            }
                        }
                    },
                    {
                        path: "/table",
                        component: TablePage,
                        loader: {
                            async search(info, query) {
                                let element = query["link"]

                                let link
                                if (element) {
                                    link = atob(element as string)
                                } else {
                                    link = ""
                                }

                                let response = await fetch(`${info.protocol}://${info.host}/service` + link, {
                                    headers : getHeaders(info)
                                })

                                process(response, getRedirect(info))

                                if (response.ok) {
                                    return mapForm(await response.json(), true)
                                }

                                throw new Error(response.status.toString())

                            }
                        }
                    }
                ]
            },
        ]
    }
]
