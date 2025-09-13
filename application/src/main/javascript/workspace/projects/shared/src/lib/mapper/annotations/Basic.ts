import 'reflect-metadata'
import {registerProperty} from "../Registry";
import NodeDescriptor from "../../domain/descriptors/NodeDescriptor";

function Basic(configuration? : Basic.Configuration) {
    return function (target : any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);

        let newConfiguration = null
        if (configuration) {
            newConfiguration = configuration.default = configuration.default || type;
        } else {
            if (type.length === 0) {
                newConfiguration = {
                    default : type
                }
            }
        }

        registerProperty(target.constructor, propertyKey, type, newConfiguration)
    }
}

namespace Basic {
    export interface Configuration {

        default? : any

        schema? : NodeDescriptor

        inSyncWith? : SyncWith

    }

    export interface SyncWith {
        property : string
        trigger? : string
        from?(instance : any) : any
        to?(instance : any) : any
    }
}

export default Basic