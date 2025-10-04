import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {AsFormArray} from "../../../components/input/as-form-array/as-form-array";
import {AsAbstractConfigured} from "./as-abstract-configured";
import Collection from "../../../mapper/annotations/Collection";

@Directive({
    selector: 'form-array',
    standalone: false
})
export class AsConfiguredArray extends AsAbstractConfigured implements OnInit {

    override control = inject(AsFormArray, {self: true, optional: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true, optional: true});

    properties: { [key: string]: any }

    ngOnInit(): void {
        const name = this.control.name();

        let property = this.parent.properties[name];
        let collection = property.annotations.get(Collection);
        if (collection) {
            this.properties = collection.targetEntity.properties
            this.control.newInstance = collection.targetEntity
        }


        /*
                Object.values(this.descriptor.validators || {})
                    .forEach(validator => this.control.addValidator(validator))
        */
    }

}
