import {ModelSignal} from '@angular/core';
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import {NodeDescriptor} from "../domain/descriptors";
import {LinkContainer} from "../domain/container";

export interface MetaSignal<T> extends ModelSignal<T> {
    descriptor: NodeDescriptor
    instance: PropDescriptor
    links : LinkContainer

    set(value: T): void;

    update(updater: (v: T) => T): void;
}