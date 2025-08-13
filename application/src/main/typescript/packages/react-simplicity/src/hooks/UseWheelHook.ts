import React, {DependencyList, useEffect, useState} from "react";

export function useWheel(callback: () => {ref : React.RefObject<HTMLElement>, maximum : number, stopPropagating? : boolean, preventDefault? : boolean}, deps : DependencyList) : [number, React.Dispatch<number>] {

    const [state, setState] = useState(0)

    useEffect(() => {

        let {ref, maximum, preventDefault, stopPropagating} = callback();

        let element = ref.current;

        let listener = (event : Event) => {

            if (Math.abs(state - element.scrollTop) > 20) {
                setState(element.scrollTop)
            }

        };

        element.addEventListener("scroll", listener)

        return () => {
            element.removeEventListener("scroll", listener)
        }

    }, [state, ...deps]);

    return [state, setState]
}