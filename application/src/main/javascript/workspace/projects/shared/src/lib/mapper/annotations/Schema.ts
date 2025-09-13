import {registerSchemaProperty} from "../Registry";
import Basic from "./Basic";

export default function Schema(configuration?: Basic.Configuration) {
    return function (target: any, propertyKey: string) {
        const type = Reflect.getMetadata("design:type", target, propertyKey);
        registerSchemaProperty(target.constructor, propertyKey, type, configuration)
    }
}