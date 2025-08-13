import "./Button.css"
import React, {ButtonHTMLAttributes, Fragment, useContext, useEffect, useRef} from "react";
import {FormContext} from "../form/Form";
import {FormModel} from "../../shared/Model";
import LinkContainerObject from "../../../domain/container/LinkContainerObject";
import LinkObject from "../../../domain/container/LinkObject";
import {useHydrated, useServer} from "../../../hooks";

function Button(properties: Button.Attributes) {

    const {children, type, force = false, ...rest} = properties

    const context: FormModel = useContext(FormContext)

    const isServer = useServer();

    const button = useRef(null);

    function isDisabled() {
        if (!context) {
            return false
        }

        if (force) {
            return false
        }

        if (isServer) {
            return false
        }

        switch (type) {
            case "submit" :
                return context.pristine || !context.valid
            case "reset" :
                return context.pristine
        }
    }

    useEffect(() => {
        let current = button.current;
        if (context) {
            context.registerButton(current)

            return () => {
                context.removeButton(current)
            }
        }
    }, []);

    return (
        <button ref={button} className={"large"} disabled={isDisabled()} type={type} {...rest}>
            {children}
        </button>
    )
}

namespace Button {
    export interface Attributes extends ButtonHTMLAttributes<HTMLButtonElement> {
        force?: boolean
    }

    export function renderButtons(container: LinkContainerObject, force?: boolean) {

        function type(link: LinkObject) {
            switch (link.method) {
                case "POST" :
                    return "submit"
                case "PUT" :
                    return "submit"
                case "DELETE" :
                    return "submit"
                default :
                    return "button"
            }
        }

        return (
            <Fragment>
                {
                    Object.values(container || {})
                        .filter(link => link.method !== "GET" && link.rel !== "validate")
                        .map(link => (
                            <Button style={{flex: 1}} key={link.rel} name={link.rel} type={type(link)}
                                    force={link.method === "DELETE" || force || link.linkType === "action"}>
                                {link.title}
                            </Button>
                        ))
                }
            </Fragment>
        )
    }

}

export default Button