import "./List.css"
import withPageable from "../../shared/Pageable";
import React, {createContext, CSSProperties} from "react";

function ListRenderer(properties: ListRenderer.Attributes) {

    const {
        className,
        children,
        window = [],
        load,
        index,
        limit,
        size,
        onRowClick,
        initialData,
        showPagination = true,
        skipPrevious,
        arrowLeft,
        arrowRight,
        skipNext,
        ...rest
    } = properties

    let element: React.ReactNode;
    if (children instanceof Array) {
        element = children.find(child => child.type === List.Item);
    } else {
        element = children
    }

    let footer;
    if (children instanceof Array) {
        footer = children.find(child => child.type === List.Footer);
    }

    return (
        <div {...rest}>
            {
                window.map((item , index)=> (
                    <List.ItemProvider key={item.id} row={item} index={index}>
                        {element}
                    </List.ItemProvider>
                ))
            }
            {
                showPagination && (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div>{index} - {index + limit} of {size}</div>
                            <button onClick={skipPrevious} className="material-icons">
                                skip_previous
                            </button>
                            <button
                                onClick={arrowLeft}
                                className="material-icons"
                                disabled={!(index > 0)}
                            >
                                keyboard_arrow_left
                            </button>
                            <button
                                onClick={arrowRight}
                                className="material-icons"
                                disabled={!(index + limit < size)}
                            >
                                keyboard_arrow_right
                            </button>
                            <button onClick={skipNext} className="material-icons">
                                skip_next
                            </button>
                        </div>
                        <div>
                            {footer}
                        </div>
                    </div>
                )
            }
        </div>
    )

}

function List(properties: List.Attributes) {
    return withPageable(ListRenderer, properties)()
}

namespace List {

    export interface Attributes {
        onRowClick?: any
        loader: withPageable.Loader
        initialData? : () => [any[], number]
        autoload?: boolean
        limit?: number
        showPagination?: boolean
        children: React.ReactNode
        value?: any
        onChange?: any
        style? : CSSProperties
    }

    export const ItemContext = createContext(null);

    export const Item = ItemContext.Consumer

    export function ItemProvider({ row, index, children } : { row : any, index : number, children : React.ReactNode }) {
        return (
            <ItemContext.Provider value={{ row, index }}>
                <div>{children}</div>
            </ItemContext.Provider>
        )
    }

    export function Footer({children} : {children : React.ReactNode}) {
        return <div>{children}</div>
    }

}

export default List

namespace ListRenderer {
    export interface Attributes {
        className: string
        children: React.ReactNode
        window: any[]
        autoload?: boolean
        showPagination?: boolean
        load: any
        initialData? : () => [any[], number]
        index: number
        limit: number
        size: number
        onRowClick: any
        skipPrevious: any
        arrowLeft: any
        arrowRight: any
        skipNext: any
    }
}