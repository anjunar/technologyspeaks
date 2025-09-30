import "reflect-metadata";
import {Constructor} from "../../domain/container/ActiveObject";

const ROW_TYPE_KEY = Symbol("rowType");

export function RowType<R>(type: Constructor<R>) {
    return function (target: any) {
        Reflect.defineMetadata(ROW_TYPE_KEY, type, target.prototype);
    };
}

export function getRowType(target: any): Constructor<any> | undefined {
    return Reflect.getMetadata(ROW_TYPE_KEY, target);
}
