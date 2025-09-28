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

@Directive({
    selector: 'as-lazy-select[property]',
    standalone: false
})
export class AsConfiguredLazySelect extends AsAbstractConfigured implements OnInit {

    override control = inject(AsLazySelect, {self: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true});

    http = inject(HttpClient)

    descriptor: NodeDescriptor;
    instance: PropertyDescriptor;

    ngOnInit(): void {
        const name = this.control.name();

        this.descriptor = (this.parent.descriptor as ObjectDescriptor).properties[name];

        if (this.parent.instance) {
            this.instance = (this.parent.instance as PropertiesContainer)[name];
        }

        this.control.placeholder.set(this.descriptor.title);

        if (this.control instanceof AsInput) {
            this.control.el.type = this.descriptor.widget;
        }

        Object.values(this.descriptor.validators || {})
            .forEach(validator => this.control.addValidator(validator))

        this.control.loader.set((query) => {
            let link = this.descriptor.links["list"];
            return this.http.get(`${link.url}?index=${query.index}&limit=${query.limit}&search=${query.search}`)
        })

    }

}
