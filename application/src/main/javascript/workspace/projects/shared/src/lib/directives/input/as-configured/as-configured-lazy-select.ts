import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import PropertyDescriptor from "../../../domain/descriptors/PropertyDescriptor";
import {PropertiesContainer} from "../../../domain/container/ActiveObject";
import {AsInput} from "../as-input/as-input";
import {AsAbstractConfigured} from "./as-abstract-configured";
import {AsLazySelect} from "../../../components/input/as-lazy-select/as-lazy-select";
import {HttpClient} from "@angular/common/http";
import UIField from "../../../mapper/annotations/UIField";

@Directive({
    selector: 'as-lazy-select[property]'
})
export class AsConfiguredLazySelect extends AsAbstractConfigured implements OnInit {

    override control = inject(AsLazySelect, {self: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true});

    http = inject(HttpClient)

    instance: PropertyDescriptor;

    ngOnInit(): void {
        const name = this.control.name();

        let property = this.parent.properties[name];

        let schema = property.annotations.get(UIField);


        if (this.parent.descriptors) {
            this.instance = (this.parent.descriptors as PropertiesContainer)[name];
        }

        this.control.placeholder.set(schema.title);

        if (this.control instanceof AsInput) {
            this.control.el.type = schema.widget;
        }

        /*
                Object.values(this.descriptor.validators || {})
                    .forEach(validator => this.control.addValidator(validator))
        */

        this.control.loader.set((query) => {
            let link = schema.link
            return this.http.get(`${link}?index=${query.index}&limit=${query.limit}&search=${query.search}`)
        })

    }

}
