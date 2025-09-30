import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {NodeDescriptor, ObjectDescriptor} from "../../../domain/descriptors";
import PropertyDescriptor from "../../../domain/descriptors/PropertyDescriptor";
import {PropertiesContainer} from "../../../domain/container/ActiveObject";
import {AsInput} from "../as-input/as-input";
import {AsAbstractConfigured} from "./as-abstract-configured";
import {AsLazySelect} from "../../../components/input/as-lazy-select/as-lazy-select";
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Mapper} from "../../../mapper";
import {Table} from "../../../domain/container";
import ManyToMany from "../../../mapper/annotations/ManyToMany";
import OneToMany from "../../../mapper/annotations/OneToMany";
import Schema from "../../../mapper/annotations/Schema";

@Directive({
    selector: 'as-lazy-select[property]',
    standalone: false
})
export class AsConfiguredLazySelect extends AsAbstractConfigured implements OnInit {

    override control = inject(AsLazySelect, {self: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true});

    http = inject(HttpClient)

    instance: PropertyDescriptor;

    ngOnInit(): void {
        const name = this.control.name();

        let property = this.parent.properties[name];

        let schema = property.annotations.get(Schema);


        if (this.parent.instance) {
            this.instance = (this.parent.instance as PropertiesContainer)[name];
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
