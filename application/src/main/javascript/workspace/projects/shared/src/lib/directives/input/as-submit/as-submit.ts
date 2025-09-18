import {Directive, ElementRef, inject, output} from '@angular/core';
import {ActiveObject, AsForm, Mapper} from "shared";
import {HttpClient, HttpErrorResponse, HttpRequest, HttpResponse} from "@angular/common/http";

export interface AsResponse<E> {
    name : string
    response : E
    form : AsForm
}

@Directive({
  selector: 'form[asSubmit]'
})
export class AsSubmit {

    asForm = inject(AsForm)

    el = inject<ElementRef<HTMLFormElement>>(ElementRef<HTMLFormElement>)

    http = inject(HttpClient)

    submit = output<AsResponse<any>>({alias : "asSubmit"})

    constructor() {
        this.el.nativeElement.addEventListener("submit", async (event) => {
            event.preventDefault()
            let button = event.submitter as HTMLButtonElement;
            let activeObject = this.asForm.value as ActiveObject;
            let link = activeObject.$meta.links[button.name];

            this.http.request<ActiveObject>(new HttpRequest(link.method as any, "/service" + link.url, Mapper.toJson(activeObject)))
                .subscribe({
                    next : (value) => {
                        let response = value as HttpResponse<any>
                        this.submit.emit({name : button.name, response : response.body, form : this.asForm})
                    },
                    error : (err: HttpErrorResponse) => {
                        console.log(err.error)
                    }
                })
        })
    }
}
