import {Directive, inject} from '@angular/core';
import {AsControlForm} from "../../as-control";
import {ObjectDescriptor} from "../../../domain/descriptors";
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {findClass} from "../../../mapper";
import {AsForm} from "../as-form/as-form";

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
export class AsConfiguredForm extends AsAbstractConfiguredForm {

    override control = inject(AsControlForm, {self: true, optional: true});

    override parent = inject(AsConfiguredForm, {skipSelf: true, optional: true});

    ngOnInit(): void {
        const name = this.control.name();
        const model = this.control.model();

        if (model?.$meta?.instance) {
            this.instance = model.$meta.instance;
        }

        if (!this.control.form) {
            this.descriptor = model.$meta.descriptors;
        } else {
            this.descriptor = (this.parent.descriptor as ObjectDescriptor).properties[name] as ObjectDescriptor;
        }

        if (this.control instanceof AsForm) {
            this.control.newInstance = findClass(this.descriptor.type)
        }

        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))

    }

}
