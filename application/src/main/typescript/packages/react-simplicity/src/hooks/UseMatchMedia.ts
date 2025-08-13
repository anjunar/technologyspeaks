import {useLayoutEffect, useState} from "react";

export function useMatchMedia(value : string) {

    const [matches, setMatches] = useState(() => true)

    useLayoutEffect(() => {
        let listener = (event : MediaQueryListEvent) =>  setMatches(event.matches);

        window.matchMedia(value).addEventListener("change", listener)

        return () => {
            window.matchMedia(value).removeEventListener("change", listener)
        }
    }, []);

    return matches

}