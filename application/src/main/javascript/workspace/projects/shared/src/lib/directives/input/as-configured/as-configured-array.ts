import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {CollectionDescriptor} from "../../../domain/descriptors";
import {AsFormArray} from "../../../components/input/as-form-array/as-form-array";
import {findClass} from "../../../mapper";
import {AsAbstractConfigured} from "./as-abstract-configured";

@Directive({
    selector: 'form-array',
    standalone : false
})
export class AsConfiguredArray extends AsAbstractConfigured implements OnInit {

    override control = inject(AsFormArray, {self: true, optional: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true, optional: true});

    descriptor: CollectionDescriptor;

    ngOnInit(): void {
        const name = this.control.name();

        this.descriptor = this.parent.descriptor.properties[name] as CollectionDescriptor

        this.control.newInstance = findClass(this.descriptor.items.type)

        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))
    }

}
