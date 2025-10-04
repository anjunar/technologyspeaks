import {Directive, inject, OnInit} from '@angular/core';
import {AsControlForm} from "../../as-control";
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {AsForm} from "../as-form/as-form";
import Reference from "../../../mapper/annotations/Reference";

@Directive({
    selector: 'form[asModel], fieldset[property]',
    providers: [
        {
            provide: AsAbstractConfiguredForm,
            useExisting: AsConfiguredForm,
        }
    ]
})
export class AsConfiguredForm extends AsAbstractConfiguredForm implements OnInit {

    override control = inject(AsControlForm, {self: true, optional: true});

    override parent = inject(AsConfiguredForm, {skipSelf: true, optional: true});

    ngOnInit(): void {
        const name = this.control.name();
        const model = this.control.model();

        if (model?.$descriptors) {
            this.descriptors = model.$descriptors
        }

        if (!this.control.form) {
            this.properties = model.constructor.properties
        } else {
            let property = this.parent.properties[name];
            let reference = property.annotations.get(Reference);
            if (reference) {
                this.properties = reference.targetEntity.properties
            }
        }

        if (this.control instanceof AsForm) {
            if (model) {
                this.control.newInstance = model.constructor
            } else {
                let newVar = this.parent.properties[name].annotations.get(Reference);
                this.control.newInstance = newVar.targetEntity
            }
        }

        /*
                Object.values(this.descriptor.validators || {})
                    .forEach(validator => this.control.addValidator(validator))
        */

    }

}
