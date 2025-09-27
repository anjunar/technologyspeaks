import {Directive, ElementRef, inject, output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpRequest, HttpResponse} from "@angular/common/http";
import {AsForm} from "../as-form/as-form";
import {ActiveObject} from "../../../domain/container";
import {Mapper} from "../../../mapper";
import {AsControl, AsControlInput, AsControlSingleForm} from "../../as-control";
import {ServerValidator} from "../../../domain/descriptors/validators/Validator";
import {AsFormArray} from "../../../components/input/as-form-array/as-form-array";

export interface AsResponse<E> {
    name: string
    response: E
    form: AsForm
}

@Directive({
    selector: 'form[asSubmit]'
})
export class AsSubmit {

    asForm = inject(AsForm)

    el = inject<ElementRef<HTMLFormElement>>(ElementRef<HTMLFormElement>)

    http = inject(HttpClient)

    submit = output<AsResponse<any>>({alias: "asSubmit"})


    setServerError(path: any[], message: string, control: AsControl<any>) {
        if (control instanceof AsControlInput) {
            control.markAsDirty()
            control.errors.set([...control.errors(), new ServerValidator(message)])
        }

        if (control instanceof AsFormArray) {
            const [segment, ...rest] = path

            let arrayForm = control.controls()[segment];
            this.setServerError(rest, message, arrayForm)
        }

        if (control instanceof AsControlSingleForm) {
            const [segment, ...rest] = path
            let controls = control.controls.get(segment);
            if (controls) {
                controls.forEach(control => {
                    this.setServerError(rest, message, control)
                })
            }
        }
    }

    constructor() {
        this.el.nativeElement.addEventListener("submit", (event) => {
            event.preventDefault()
            let button = event.submitter as HTMLButtonElement;
            let activeObject = this.asForm.model() as ActiveObject;
            let link = activeObject.$meta.links[button.name];

            this.http.request<ActiveObject>(new HttpRequest(link.method as any, "/service" + link.url, Mapper.toJson(activeObject)))
                .subscribe({
                    next: (value) => {
                        let response = value as HttpResponse<any>
                        this.submit.emit({name: button.name, response: response.body, form: this.asForm})
                    },
                    error: (err: HttpErrorResponse) => {
                        let error = err.error;
                        error.forEach((e: any) => {
                            this.setServerError(e.path, e.message, this.asForm)
                        });

                    }
                })
        })
    }
}
