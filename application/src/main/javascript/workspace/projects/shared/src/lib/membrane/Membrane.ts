import {Temporal, TemporalAmount} from "@js-joda/core";
import {findClass, findProperties} from "../mapper/Registry";

const regex = /\d+/;

export function objectMembrane(object : any, callbacks : ((name : string[], value : any) => void)[], path : string[] = []) {
    if (object instanceof Object) {
        let proxy = new Proxy(object, {
            set(target: any, p: string | symbol, newValue: any, receiver: any): boolean {
                let oldValue = Reflect.get(target, p, receiver);
                if (oldValue === newValue) {
                    return true
                }

                let result = Reflect.set(target, p, newValue, receiver);

                let newPath = Array.from(path)
                // @ts-ignore
                newPath.push(p)

                callbacks.forEach(callback => callback(newPath, newValue))

                return result
            },
            get(target: any, p: string | symbol, receiver: any): any {
                if (p === "isProxy") {
                    return true
                }

                if (p === "$callbacks") {
                    return callbacks
                }

                if (p === "$resolve") {
                    return target
                }

                if (typeof Node !== "undefined" && target instanceof Node) {
                    return Reflect.get(target, p, target)
                }

                let result = Reflect.get(target, p, receiver);

                if (p === "constructor") {
                    return result
                }

                if (result instanceof Temporal || result instanceof TemporalAmount) {
                    return result
                }

                let newPath = Array.from(path)
                // @ts-ignore
                newPath.push(p)

                if (result instanceof Array) {
                    // @ts-ignore
                    if (result.isProxy) {
                        return result
                    }
                    return arrayMembrane(result, callbacks, newPath)
                }

                if (result instanceof Object) {
                    if (result.isProxy) {
                        return result
                    }

                    return objectMembrane(result, callbacks, newPath)
                }

                return result
            }
        });

        let Class: any = findClass(proxy.$type);
        if (Class) {
            let properties = findProperties(Class);
            let syncedProperties = properties.filter(property => property.configuration?.inSyncWith);

            if (syncedProperties.length > 0) {
                callbacks.push((propertyName, value) => {
                    let descriptorTo = syncedProperties.find(property => property.name === propertyName[propertyName.length - 1])
                    if (descriptorTo) {
                        let inSyncWith = descriptorTo.configuration.inSyncWith;
                        proxy[inSyncWith.property] = inSyncWith.to(proxy)
                    }
                    let descriptorTrigger = syncedProperties.find(property => property.configuration.inSyncWith.trigger === propertyName[propertyName.length - 1])
                    if (descriptorTrigger) {
                        let inSyncWith = descriptorTrigger.configuration.inSyncWith;
                        proxy[inSyncWith.property] = inSyncWith.to(proxy)
                    }
                    let descriptorFrom = syncedProperties.find(property => property.configuration.inSyncWith.property === propertyName[propertyName.length - 1])
                    if (descriptorFrom) {
                        let inSyncWith = descriptorFrom.configuration.inSyncWith;
                        if (inSyncWith.from) {
                            proxy[descriptorFrom.name] = inSyncWith.from(proxy)
                        }
                    }

                })
            }
        }

        return proxy
    }

    return object
}

export function arrayMembrane(array : any[], callbacks : ((name : string[], value : any) => void)[], path : string[] = []) {
    return new Proxy(array, {
        set(target: any[], p: string, newValue: any, receiver: any) {

            let oldValue = Reflect.get(target, p, receiver)

            let newPath = Array.from(path)
            // @ts-ignore
            newPath.push(p)

            if (oldValue !== newValue) {
                let exec = regex.exec(p);

                let result;
                if (exec) {
                    let object;
                    if (newValue.$data) {
                        object = newValue.$data
                    } else {
                        object = newValue
                    }

                    result = Reflect.set(target, p, object, receiver);
                    callbacks.forEach(callback => callback(newPath, object))
                } else {
                    result = Reflect.set(target, p, newValue, receiver);
                    callbacks.forEach(callback => callback(newPath, newValue))
                }

                return result
            }

            return true
        },
        get(target: any[], p: string, receiver: any) {

            if (p === "$callbacks") {
                return callbacks
            }

            if (p === "$path") {
                return path
            }

            let object = Reflect.get(target, p, receiver);

            let newPath = Array.from(path)
            // @ts-ignore
            newPath.push(p)

            if (object) {
                if (typeof p === "symbol") {
                    return object
                }

                let exec = regex.exec(p)
                if (exec) {
                    if (object.isProxy) {
                        return object
                    }
                    return objectMembrane(object, callbacks, newPath)
                }

                return object
            }

            return object
        }
    });
}

