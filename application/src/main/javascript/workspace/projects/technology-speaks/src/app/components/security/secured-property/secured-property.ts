import {Component, inject, ViewEncapsulation} from '@angular/core';
import {AsAbstractConfiguredForm, AsIcon, Link, WindowManagerService} from "shared";
import {SecuredForm} from "./secured-form/secured-form";
import {HttpClient} from "@angular/common/http";
import {PropertiesContainer} from "../../../../../../shared/src/lib/domain/container/ActiveObject";
import ManagedProperty from "../../../domain/shared/ManagedProperty";

@Component({
    selector: 'secured-property',
    imports: [AsIcon],
    templateUrl: './secured-property.html',
    styleUrl: './secured-property.css',
    encapsulation: ViewEncapsulation.None
})
export class SecuredProperty {

    service = inject(WindowManagerService)

    http = inject(HttpClient)

    configurable = inject(AsAbstractConfiguredForm)

    open() {

        let configurable = this.configurable
        while (configurable) {
            if (configurable.parent) {
                configurable = configurable.parent as AsAbstractConfiguredForm
            } else {
                break
            }
        }

        let link = (configurable.descriptors as PropertiesContainer)[this.configurable.control.name()].security as Link

        this.http.get(link.url)
            .subscribe(response => {
                this.service.open({
                    id: "securityForm",
                    title: "Visibility",
                    component: SecuredForm,
                    inputs: {
                        form: ManagedProperty.fromJSON(response)
                    }
                })
            })

    }

}
