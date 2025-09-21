import {Component, inject, input, model, ViewEncapsulation} from '@angular/core';
import {AsInputContainer} from "shared";
import {FormsModule} from "@angular/forms";
import * as webauthnJson from "@github/webauthn-json";
import {Router} from "@angular/router";
import {AppService} from "../../../app.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'login-page',
    imports: [AsInputContainer, FormsModule],
    templateUrl: './login-page.html',
    styleUrl: './login-page.css',
    encapsulation: ViewEncapsulation.None
})
export class LoginPage {

    email = model<string>()

    router = inject(Router);

    service = inject(AppService)

    http = inject(HttpClient)

    async onSubmit() {

        const credentialGetOptions = await fetch('/service/security/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: this.email()}),
        }).then(resp => resp.json());

        const publicKeyCredential = await webauthnJson.get(credentialGetOptions);

        const responseFinish = await fetch('/service/security/login/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.email(),
                publicKeyCredential
            }),
        });

        if (responseFinish.ok) {
            const params = new URLSearchParams(window.location.search)
            let redirect = params.get("redirect");
            this.service.run(this.http).then(() => {
                this.router.navigateByUrl(redirect ? decodeURIComponent(redirect) : "/", {onSameUrlNavigation : "reload"})
            })
        } else {
            alert("Something went wrong")
        }
    }

}
