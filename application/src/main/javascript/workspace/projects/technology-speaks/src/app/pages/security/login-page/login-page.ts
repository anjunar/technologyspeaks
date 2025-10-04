import {Component, inject, model, signal, ViewEncapsulation} from '@angular/core';
import * as webauthnJson from "@github/webauthn-json";
import {Router} from "@angular/router";
import {AppService} from "../../../app.service";
import {HttpClient} from "@angular/common/http";
import Login from "../../../domain/security/Login";
import {
    AsForm, AsInput,
    AsInputContainer, Mapper, PropertyFormsModule
} from "shared";

@Component({
    selector: 'login-page',
    imports: [PropertyFormsModule, AsInputContainer, AsForm, AsInput],
    templateUrl: './login-page.html',
    styleUrl: './login-page.css',
    encapsulation: ViewEncapsulation.None
})
export class LoginPage {

    model = signal(Login.newInstance())

    router = inject(Router);

    service = inject(AppService)

    http = inject(HttpClient)

    async onSubmit(event : Event) {
        event.preventDefault()

        const credentialGetOptions = await fetch('/service/security/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: this.model().email()}),
        }).then(resp => resp.json());

        const publicKeyCredential = await webauthnJson.get(credentialGetOptions);

        const responseFinish = await fetch('/service/security/login/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.model().email(),
                publicKeyCredential
            }),
        });

        if (responseFinish.ok) {
            const params = new URLSearchParams(window.location.search)
            let redirect = params.get("redirect");
            this.service.run(this.http).then(() => {
                this.router.navigateByUrl(redirect ? decodeURIComponent(redirect) : "/", {onSameUrlNavigation: "reload"})
            })
        } else {
            alert("Something went wrong")
        }
    }

}
