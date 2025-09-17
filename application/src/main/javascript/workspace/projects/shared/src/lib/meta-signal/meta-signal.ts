import {Signal} from '@angular/core';
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import {LinkContainer, NodeDescriptor} from "shared";

export interface MetaSignal<T> extends Signal<T> {
    descriptor: NodeDescriptor
    instance: PropDescriptor
    links : LinkContainer

    set(value: T): void;

    update(updater: (v: T) => T): void;
}