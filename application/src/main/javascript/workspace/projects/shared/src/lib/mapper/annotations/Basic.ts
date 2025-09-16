import 'reflect-metadata'
import {registerProperty} from "../Registry";
import NodeDescriptor from "../../domain/descriptors/NodeDescriptor";

function Basic(configuration? : Basic.Configuration) {
    return function (target : any, propertyKey: string) {
        registerProperty(target.constructor, propertyKey, null, configuration)
    }
}

namespace Basic {
    export interface Configuration {

        default? : any

        schema? : NodeDescriptor

        inSyncWith? : SyncWith

        signal? : boolean

    }

    export interface SyncWith {
        property : string
        trigger? : string
        from?(instance : any) : any
        to?(instance : any) : any
    }
}

export default Basic