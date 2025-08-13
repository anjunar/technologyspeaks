import "./LazySelect.css"
import React, {createContext, CSSProperties, useDeferredValue, useEffect, useLayoutEffect, useRef, useState} from "react"
import {Max, Min, Validator} from "../../../shared/Model"
import withPageable from "../../../shared/Pageable"
import {useInput} from "../../../../hooks/UseInputHook";
import Loader = withPageable.Loader;

function LazySelectRenderer(properties: LazySelectRenderer.Attributes) {

    const {
        className,
        loader,
        multiSelect,
        selectable,
        standalone,
        placeholder,
        onModel,
        onFocus,
        onBlur,
        name = "default",
        disabled = false,
        dynamicWidth,
        getId = (value: any) => value.id,
        getName = (value: any) => value.name,
        getValue = (value : any) => value,
        children,
        window,
        load,
        index,
        limit,
        size,
        skipPrevious,
        arrowLeft,
        arrowRight,
        skipNext,
        value,
        onChange,
        onRowClick,
        min,
        max,
        validators,
        ...rest
    } = properties

    const overlayRef = useRef(null)

    const input = useRef(null);

    const [model, state, setState] = useInput(name, value, standalone, multiSelect ? "lazy-multi-select" : "lazy-select")

    const [open, setOpen] = useState(false)

    const [content, setContent] = useState("")

    const [search, setSearch] = useState("")

    const searchDeferred = useDeferredValue(search);

    useLayoutEffect(() => {
        if (searchDeferred.length > 0) {
            load({index, limit, name : searchDeferred}, () => {
                setOpen(true)
            })
        }
    }, [searchDeferred]);

    const onInputClickListener: React.MouseEventHandler<HTMLDivElement> = event => {
        event.stopPropagation()
        event.preventDefault()
        if (!disabled) {
            load({index, limit}, () => {
                setOpen(true)
            })
        }
    }

    const onOverlayClickListener: React.MouseEventHandler<HTMLDivElement> = event => {
        event.stopPropagation()
        event.preventDefault()
    }

    const onOptionClick: React.MouseEventHandler<HTMLInputElement> = event => {

        let option = getValue(event)

        if (multiSelect) {
            const find = state.findIndex((element: any) => getId(element) === getId(option))
            if (find !== -1) {
                state.splice(find, 1)
            } else {
                state.push(option)
            }
            model.validate()
            model.fireCallbacks(true)
            if (onChange) {
                onChange(state)
            }
        } else {
            if (state !== null && getId(option) === getId(state)) {
                setState(null)
                if (onChange) {
                    onChange(null)
                }
            } else {
                setState(option)
                if (onChange) {
                    onChange(option)
                }
            }
        }

        if (model.value) {
            if (multiSelect) {
                setContent(model.value.map((item: any) => getName(item)).join(" "))
            } else {
                setContent(getName(model.value))
            }
        } else {
            setContent("")
        }

        if (onModel) {
            onModel(model)
        }

    }

    useEffect(() => {
        /*
                if (overlayRef.current && appContext.service) {
                    let isInBounds = appContext.service.isClientRectInBounds(
                        overlayRef.current
                    )

                    if (overlayRef.current?.style) {
                        let style = overlayRef.current.style

                        if (isInBounds) {
                            style.top = "14px"
                            style.bottom = "initial"
                        } else {
                            style.top = "initial"
                            style.bottom = "24px"
                        }
                    }
                }
        */
    }, [open])

    useLayoutEffect(() => {

        if (! state && multiSelect) {
            model.oldValue = JSON.stringify([])
            setState([])
        }

        let windowClickListener = () => {
            setOpen(false)
        }

        if (model.value) {
            if (multiSelect) {
                setContent(model.value.map((item: any) => getName(item)).join(" "))
            } else {
                setContent(getName(model.value))
            }
        }

        if (onModel) {
            onModel(model)
        }

        // For form validation -> Error messages
        model.callbacks.push(() => {
            if (onModel) {
                onModel(model)
            }
        })

        if (min) {
            model.addValidator(new Min(min))
        }
        if (max) {
            model.addValidator(new Max(max))
        }

        if (validators) {
            for (const validator of validators) {
                model.addValidator(validator)
            }
        }

        document.addEventListener("click", windowClickListener)
        return () => {
            document.removeEventListener("click", windowClickListener)
        }

    }, [])

    useLayoutEffect(() => {
        if (onModel) {
            onModel(model)
        }
    }, [value]);


    function selected(option: any) {
        if (state) {
            if (multiSelect) {
                return state.some((element: any) => getId(element) === getId(getValue(option)))
            } else {
                return getId(state) === getId(getValue(option))
            }
        }
        return false
    }

    return (
        <div className={(className ? className + " " : "") + `lazy-select ${model.dirty ? "dirty" : ""} ${model.valid ? "valid" : "error"} ${typeof document === "object" ? (document.activeElement === input.current ? "focus" : "blur") : "blur"}`} {...rest}>
            <div tabIndex={0}
                 ref={input}
                 onClick={onInputClickListener}
                 className={`text-base`}
                 onBlur={onBlur}
                 onFocus={onFocus}>
                {(state == null || state.length === 0) && (
                    <div>{placeholder}</div>
                )}
                {content}
            </div>
            {open ? (
                <div ref={overlayRef} className="overlay" onClick={onOverlayClickListener}>
                    <div style={{textAlign: "center"}}>
                        <button type="button" className={"material-icons"} onClick={arrowLeft} disabled={index === 0}>
                            arrow_drop_up
                        </button>
                    </div>
                    <input style={{width : "100%"}} type={"text"} value={search} onChange={(event) => setSearch(event.target.value)}/>
                    <table style={{width: "calc(100% - 32px)"}}>
                        <tbody>
                        {window.map((option, index) => (
                            <tr key={getId(getValue(option))}>
                                {
                                    selectable && (
                                        <td>
                                            <input type="checkbox" defaultChecked={selected(option)}
                                                   className={selected(option) ? "checked" : "unchecked"}
                                                   onClick={() => onOptionClick(option)}/>
                                        </td>
                                    )
                                }
                                <LazySelect.Provider option={option} index={index} selected={selected(option)}>
                                    <div className="item" onClick={() => onOptionClick(option)}>
                                        {children}
                                    </div>
                                </LazySelect.Provider>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div style={{textAlign: "center"}}>
                        <button type="button" className="material-icons" onClick={arrowRight} disabled={index > size - limit - 1}>
                            arrow_drop_down
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    )
}

function LazySelect(properties: LazySelect.Attributes) {
    return withPageable(LazySelectRenderer, properties)()
}

const SelectContext = createContext(null)

namespace LazySelect {

    export interface Attributes {
        autoload?: boolean
        children: React.ReactNode
        dynamicWidth? : boolean
        getId?: (value : any) => any
        getName?: (value : any) => any
        getValue? : (value : any) => any
        limit?: number
        loader: Loader
        max?: number,
        min?: number
        multiSelect?: boolean
        name?: string
        onChange?: any
        onRowClick?: any
        placeholder?: React.ReactNode
        selectable? : boolean
        standalone? : boolean
        style? : CSSProperties,
        validators?: Validator[]
        value?: any
    }

    export const Option = SelectContext.Consumer

    export function Provider({option, index, selected, children}: {
        option: any,
        index: number,
        selected: boolean,
        children: React.ReactNode
    }) {
        return (
            <SelectContext.Provider value={{option, index, selected}}>
                <td>{children}</td>
            </SelectContext.Provider>
        )
    }

}

export default LazySelect

namespace LazySelectRenderer {
    import Loader = withPageable.Loader;

    export interface Attributes {
        arrowLeft: any
        arrowRight: any
        children: React.ReactNode
        className: string
        disabled: boolean
        dynamicWidth? : boolean
        getId: (value : any) => any
        getName: (value : any) => any
        getValue? : (value : any) => any
        index: number
        limit: number
        load: any
        loader: Loader
        max?: number
        min?: number
        multiSelect: boolean
        name: string
        onBlur: any
        onChange: any
        onFocus: any
        onModel: any
        onRowClick: any,
        placeholder: React.ReactNode
        selectable : boolean
        size: number
        skipNext: any
        skipPrevious: any
        standalone: boolean
        validators?: Validator[]
        value: any
        window: any[]
    }
}
