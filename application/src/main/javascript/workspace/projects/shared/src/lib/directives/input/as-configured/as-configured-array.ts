import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {CollectionDescriptor} from "../../../domain/descriptors";
import {AsFormArray} from "../../../components/input/as-form-array/as-form-array";
import {findClass} from "../../../mapper";
import {AsAbstractConfigured} from "./as-abstract-configured";
import ManyToOne from "../../../mapper/annotations/ManyToOne";
import OneToOne from "../../../mapper/annotations/OneToOne";
import ManyToMany from "../../../mapper/annotations/ManyToMany";
import OneToMany from "../../../mapper/annotations/OneToMany";

@Directive({
    selector: 'form-array',
    standalone : false
})
export class AsConfiguredArray extends AsAbstractConfigured implements OnInit {

    override control = inject(AsFormArray, {self: true, optional: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true, optional: true});

    properties : { [key: string]: any }

    ngOnInit(): void {
        const name = this.control.name();

        let property = this.parent.properties[name];
        let manyToMany = property.annotations.get(ManyToMany);
        if (manyToMany) {
            this.properties = manyToMany.targetEntity.properties
            this.control.newInstance = manyToMany.targetEntity
        }

        let oneToMany = property.annotations.get(OneToMany);
        if (oneToMany) {
            this.properties = oneToMany.targetEntity.properties
            this.control.newInstance = oneToMany.targetEntity
        }



/*
        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))
*/
    }

}
