import {Component, effect, inject, Injector, input, Type, ViewEncapsulation} from '@angular/core';
import {AsIcon} from "../../../../../../shared/src/lib/components/layout/as-icon/as-icon";
import {AsForm} from "../../../../../../shared/src/lib/directives/input/as-form/as-form";
import {
    AsConfigured, Link,
    Mapper,
    WindowManagerService
} from "shared";
import {SecuredForm} from "./secured-form/secured-form";
import {HttpClient} from "@angular/common/http";
import {AsControlForm} from "../../../../../../shared/src/lib/directives/as-control";
import {PropertiesContainer} from "../../../../../../shared/src/lib/domain/container/ActiveObject";

@Component({
  selector: 'secured-property',
  imports: [AsIcon],
  templateUrl: './secured-property.html',
  styleUrl: './secured-property.css',
  encapsulation : ViewEncapsulation.None
})
export class SecuredProperty {

    service = inject(WindowManagerService)

    http = inject(HttpClient)

    configurable = inject(AsConfigured)

    open() {

        let configurable = this.configurable
        while (configurable) {
            if (configurable.parent) {
                configurable = configurable.parent
            } else {
                break
            }
        }

        let link = (configurable.instance as PropertiesContainer)[this.configurable.control.name()].security as Link

        this.http.get(link.url)
            .subscribe(response => {
                this.service.open({
                    id : "securityForm",
                    title : "Visibility",
                    component : SecuredForm,
                    inputs : {
                        form : Mapper.domain(response)
                    }
                })
            })

    }

}
