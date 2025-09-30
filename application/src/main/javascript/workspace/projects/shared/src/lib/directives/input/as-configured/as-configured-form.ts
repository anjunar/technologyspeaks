import {Directive, inject, OnInit} from '@angular/core';
import {AsControlForm} from "../../as-control";
import {ObjectDescriptor} from "../../../domain/descriptors";
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {findClass} from "../../../mapper";
import {AsForm} from "../as-form/as-form";
import Basic from "../../../mapper/annotations/Basic";
import ManyToOne from "../../../mapper/annotations/ManyToOne";
import OneToOne from "../../../mapper/annotations/OneToOne";

@Directive({
    selector: 'form[asModel], fieldset[property]',
    standalone : false,
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

        if (model?.$meta?.instance) {
            this.instance = model.$meta.instance;
        }

        if (!this.control.form) {
            this.properties = model.constructor.properties
        } else {
            let property = this.parent.properties[name];
            let manyToOne = property.annotations.get(ManyToOne);
            if (manyToOne) {
                this.properties = manyToOne.targetEntity.properties
            }

            let oneToOne = property.annotations.get(OneToOne);
            if (oneToOne) {
                this.properties = oneToOne.targetEntity.properties
            }
        }

        if (this.control instanceof AsForm) {
            this.control.newInstance = model.constructor
        }

/*
        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))
*/

    }

}
