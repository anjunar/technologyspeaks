import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {AsControlInput} from "../../as-control";
import {NodeDescriptor, ObjectDescriptor} from "../../../domain/descriptors";
import {PropertiesContainer} from "../../../domain/container/ActiveObject";
import PropertyDescriptor from "../../../domain/descriptors/PropertyDescriptor";
import {AsInput} from "../as-input/as-input";
import {AsAbstractConfigured} from "./as-abstract-configured";

@Directive({
    selector: 'input[property]',
    standalone : false,
})
export class AsConfiguredInput extends AsAbstractConfigured implements OnInit {

    override control = inject(AsControlInput, {self: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true});

    descriptor: NodeDescriptor;
    instance: PropertyDescriptor;

    ngOnInit(): void {
        const name = this.control.name();

        this.descriptor = (this.parent.descriptor as ObjectDescriptor).properties[name];

        if (this.parent.instance) {
            this.instance = (this.parent.instance as PropertiesContainer)[name];
        }

        this.control.placeholder.set(this.descriptor.title);

        if (this.control instanceof AsInput) {
            this.control.el.type = this.descriptor.widget;
        }

        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))

    }

}
