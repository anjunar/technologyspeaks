import {Directive, inject, OnInit} from '@angular/core';
import {CollectionDescriptor} from "../../../domain/descriptors";
import {AsArrayForm} from "../../../components/input/as-array-form/as-array-form";
import {AsConfiguredArray} from "./as-configured-array";
import {findClass} from "../../../mapper";
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";

@Directive({
    selector: 'array-form',
    standalone : false,
    providers: [
        {
            provide: AsAbstractConfiguredForm,
            useExisting: AsConfiguredArrayForm,
        }
    ]
})
export class AsConfiguredArrayForm extends AsAbstractConfiguredForm implements OnInit {

    override control = inject(AsArrayForm, {self: true, optional: true});

    override parent = inject(AsConfiguredArray, {skipSelf: true});

    ngOnInit(): void {
        const model = this.control.model();

        this.instance = model.$meta?.instance;

        this.descriptor = (this.parent.descriptor as CollectionDescriptor).items;

        this.control.newInstance = findClass(this.descriptor.type)

        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))

    }

}
