function isOfType<T>(obj: any, type: new (...args: any[]) => T): obj is T {
    return obj instanceof type;
}

export function match<T, O>(object: T): Matcher<T, O> {
    let result : O
    let matched = false
    return {
        withFunction<E>(fn: Function, callback: (value: E) => O): Matcher<T, O> {
            if (object === fn) {
                if (! result) {
                    // @ts-ignore
                    result = callback(object as E);

                    matched = true;
                }
            }
            return this
        },
        withObject<E extends T>(clazz: new (...args: any[]) => E, callback: (value: E) => O): Matcher<T, O> {
            if (isOfType(object, clazz)) {
                if (! result) {
                    result = callback(object as E);

                    matched = true;
                }
            }
            return this;
        },
        withType<E>(type: string, callback: (value: E) => O): Matcher<T, O> {
            if (typeof object === type) {
                if (! result) {
                    // @ts-ignore
                    result = callback(object as E);

                    matched = true;
                }
            }
            return this
        },
        exhaustive(): O {
            if (! matched) {
                throw new Error("Nothing matched for " + JSON.stringify(object))
            }
            return result
        },
        nonExhaustive() : O {
            return result
        }
    };
}

interface Matcher<T, O> {
    withFunction<E extends T>(fn : Function, callback: (value: E) => O): Matcher<T, O>;
    withObject<E extends T>(clazz: abstract new (...args: any[]) => E, callback: (value: E) => O): Matcher<T, O>;
    withType<E extends T>(type: string, callback: (value: E) => O): Matcher<T, O>;
    exhaustive(): O;
    nonExhaustive(): O;
}