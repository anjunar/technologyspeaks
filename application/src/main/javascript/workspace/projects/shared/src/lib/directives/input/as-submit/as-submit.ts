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
        this._setServerErrorRecursive(this.asForm, path, error);
    }

    private _setServerErrorRecursive(form: AsForm, path: string[], error: any) {
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
                const ngControl = (c.valueAccessor as any).control as AbstractControl | undefined;
                if (ngControl) {
                    const existing = ngControl.errors || {};
                    ngControl.setErrors({
                        ...existing,
                        server: {message : error}
                    });
                }
            } else if (c instanceof AsForm) {
                this._setServerErrorRecursive(c, rest, error);
            }
        }
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
                        err.error.forEach((error : any) => {
                            this.setServerError(error.path, error.message)
                        })
                    }
                })
        })
    }
}
