import {Directive, ElementRef, inject, output} from '@angular/core';
import {ActiveObject, AsForm, Mapper} from "shared";
import {HttpClient, HttpErrorResponse, HttpRequest, HttpResponse} from "@angular/common/http";
import {AbstractControl} from "@angular/forms";

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

    setServerError(path: string[], error: any) {
        function setServerErrorRecursive(form: AsForm, path: string[], error: any) {
            if (path.length === 0) {
                const existing = form.control?.errors || {};
                form.control?.setErrors({
                    ...existing,
                    server: {message : error}
                });
                return;
            }

            const [segment, ...rest] = path;
            const controls = form.controls.get(segment);

            if (!controls) {
                return;
            }

            for (const c of controls) {
                if (rest.length === 0) {
                    const formControl = (c.valueAccessor as any).control as AbstractControl | undefined;
                    if (formControl) {
                        const existing = formControl.errors || {};
                        formControl.setErrors({
                            ...existing,
                            server: {message : error}
                        });
                    }
                } else if (c instanceof AsForm) {
                    setServerErrorRecursive(c, rest, error);
                }
            }
        }

        setServerErrorRecursive(this.asForm, path, error);
    }

    constructor() {
        this.el.nativeElement.addEventListener("submit", (event) => {
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
                        const grouped = new Map<string, { path: any[], messages: string[] }>();

                        err.error.forEach((e: any) => {
                            const key = JSON.stringify(e.path);
                            if (!grouped.has(key)) {
                                grouped.set(key, { path: e.path, messages: [] });
                            }
                            grouped.get(key)!.messages.push(e.message);
                        });

                        grouped.forEach(({ path, messages }) => {
                            this.setServerError(path, messages);
                        });
                    }
                })
        })
    }
}
