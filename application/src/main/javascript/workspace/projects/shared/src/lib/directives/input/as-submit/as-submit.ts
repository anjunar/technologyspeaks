import {Directive, ElementRef, inject, output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpRequest, HttpResponse} from "@angular/common/http";
import {AbstractControl, FormArray, FormGroup} from "@angular/forms";
import {AsForm} from "../as-form/as-form";
import {ActiveObject} from "../../../domain/container";
import {Mapper} from "../../../mapper";
import {AsControl} from "../../as-control";

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

    setServerError(path: any[], error: any) {
        function setServerErrorRecursive(form: AsControl, path: any[], error: any) {
/*
            if (path.length === 0) {
                const existing = form.errors || {};
                form.setErrors({
                    ...existing,
                    server: {message: error}
                });
                return;
            }

            if (form instanceof FormArray) {
                const [segment, ...rest] = path;
                setServerErrorRecursive(form.controls[segment], rest, error)
            } else if (form instanceof FormGroup) {
                const [segment, ...rest] = path;
                let control = form.controls[segment] as AbstractControl;

                if (control instanceof FormGroup) {
                    const controls = control.controls

                    for (const c of Object.values(controls)) {
                        if (rest.length === 0) {
                            const formControl = c
                            if (formControl) {
                                const existing = formControl.errors || {};
                                formControl.setErrors({
                                    ...existing,
                                    server: {message: error}
                                });
                            }
                        } else {
                            setServerErrorRecursive(c, rest, error);
                        }
                    }
                } else {
                    setServerErrorRecursive(control, rest, error)
                }
            }
*/


        }

        // setServerErrorRecursive(this.asForm.controls, path, error);
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
                        const grouped = new Map<string, { path: any[], messages: string[] }>();

                        err.error.forEach((e: any) => {
                            const key = JSON.stringify(e.path);
                            if (!grouped.has(key)) {
                                grouped.set(key, {path: e.path, messages: []});
                            }
                            grouped.get(key)!.messages.push(e.message);
                        });

                        grouped.forEach(({path, messages}) => {
                            this.setServerError(path, messages);
                        });
                    }
                })
        })
    }
}
