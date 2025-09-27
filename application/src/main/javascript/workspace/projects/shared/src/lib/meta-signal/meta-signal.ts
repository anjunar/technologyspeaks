import {ModelSignal} from '@angular/core';
import PropertyDescriptor from "../domain/descriptors/PropertyDescriptor";
import {NodeDescriptor} from "../domain/descriptors";
import {LinkContainer} from "../domain/container";

export interface MetaSignal<T> extends ModelSignal<T> {
    descriptor: NodeDescriptor
    instance: PropertyDescriptor
    links : LinkContainer

    set(value: T): void;

    update(updater: (v: T) => T): void;
}