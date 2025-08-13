import "./Tabs.css"
import React, {CSSProperties, useMemo} from "react"
import {v4} from "uuid";

function Tabs(properties: Tabs.Attributes) {

    const {page, onPage, className, children, centered = true, ...rest} = properties

    const tabs = useMemo(() => {
        if (children) {
            const tabModel = children.map(
                child =>
                    new (class CustomTab extends TabModel {
                        onSelect() {
                            for (const tab of tabModel) {
                                tab.fire(false)
                            }
                            this.selected = true
                            this.page = tabModel.indexOf(this)
                            this.fire(this.selected)
                            onPage(tabModel.indexOf(this))
                        }
                    })()
            )

            return children.map((child, index) => {
                return React.cloneElement(child, {
                    // @ts-ignore
                    selected: page === index,
                    tab: tabModel[index],
                    key: tabModel[index].id
                })
            })
        }
        return []
    }, [children])

    return (
        <div className={(className ? className + " " : "") + "tabs"} {...rest}>
            {
                centered && <div className="placeholder"></div>
            }
            {tabs}
            <div className="placeholder"></div>
        </div>
    )
}

export abstract class TabModel {

    id = v4()

    listeners : any[] = []
    selected : boolean = false
    page : number

    abstract onSelect() : void

    addListener(listener : any) {
        this.listeners.push(listener)
    }

    fire(selected : any) {
        for (const listener of this.listeners) {
            listener(selected)
        }
    }
}

namespace Tabs {
    export interface Attributes {
        page: number
        onPage?: any
        className?: string
        children: React.ReactElement[]
        style? : CSSProperties
        centered? : boolean
    }
}

export default Tabs