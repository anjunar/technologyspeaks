import {Component, effect, inject, input, ViewEncapsulation} from '@angular/core';
import {AsIcon} from "../../../../../../shared/src/lib/components/layout/as-icon/as-icon";
import {AsForm} from "../../../../../../shared/src/lib/directives/input/as-form/as-form";
import {
    Mapper,
    WindowManagerService
} from "shared";
import {SecuredForm} from "./secured-form/secured-form";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'secured-property',
  imports: [AsIcon],
  templateUrl: './secured-property.html',
  styleUrl: './secured-property.css',
  encapsulation : ViewEncapsulation.None
})
export class SecuredProperty {

    form = input.required<AsForm>()

    property = input.required<string>()

    service = inject(WindowManagerService)

    http = inject(HttpClient)

    open() {
        let link = this.form().instance[this.property()].security

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
