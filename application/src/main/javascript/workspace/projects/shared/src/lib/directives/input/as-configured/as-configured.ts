import { Directive, inject, OnInit } from '@angular/core';
import {
    AsControlArrayForm,
    AsControlForm,
    AsControlInput,
    AsControlSingleForm
} from "../../as-control";
import { CollectionDescriptor, NodeDescriptor, ObjectDescriptor } from "../../../domain/descriptors";
import { PropertiesContainer } from "../../../domain/container/ActiveObject";
import PropertyDescriptor from "../../../domain/descriptors/PropertyDescriptor";
import { AsFormArray } from "../../../components/input/as-form-array/as-form-array";
import { AsArrayForm } from "../../../components/input/as-array-form/as-array-form";
import { AsInput } from "../as-input/as-input";
import {match} from "../../../pattern-match";

@Directive({
    selector: '[configured]'
})
export class AsConfigured implements OnInit {

    control = inject(AsControlInput, { self: true, optional: true }) || inject(AsControlForm, { self: true, optional: true });

    parent = inject(AsConfigured, { skipSelf: true, optional: true });

    descriptor: NodeDescriptor;
    instance: PropertiesContainer | PropertyDescriptor;

    ngOnInit(): void {
        const name = this.control.name();
        const model = this.control.model();

        match(this.control)
            .withObject(AsControlSingleForm, control => {
                this.instance = model.$meta.instance;

                if (!control.form) {
                    this.descriptor = model.$meta.descriptors;
                } else {
                    if (this.control instanceof AsArrayForm) {
                        this.descriptor = (this.parent.descriptor as CollectionDescriptor).items;
                    } else {
                        this.descriptor = (this.parent.descriptor as ObjectDescriptor).properties[name];
                    }
                }
            })
            .withObject(AsFormArray, control => {
                this.descriptor = (this.parent.descriptor as ObjectDescriptor).properties[name] as CollectionDescriptor;
            })
            .withObject(AsControlInput, control => {
                this.descriptor = (this.parent.descriptor as ObjectDescriptor).properties[name];
                this.instance = (this.parent.instance as PropertiesContainer)[name];

                control.placeholder.set(this.descriptor.title);

                if (control instanceof AsInput) {
                    control.el.type = this.descriptor.widget;
                }
            })

        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))

    }
}