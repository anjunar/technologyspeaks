import {Component, inject, input, model, ViewEncapsulation} from '@angular/core';
import {AsInputContainer} from "shared";
import {FormsModule} from "@angular/forms";
import * as webauthnJson from "@github/webauthn-json";
import {Router} from "@angular/router";

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
            let link = responseFinish.headers.get("Link");
            if (link) {
                let regex = /<([^>]+)>; rel="(.+)"/g
                let exec = regex.exec(link);
                this.router.navigateByUrl(exec[1])
            } else {
                const params = new URLSearchParams(window.location.search)
                let redirect = params.get("redirect");
                this.router.navigateByUrl(redirect ? decodeURIComponent(redirect) : "/")
            }
        } else {
            alert("Something went wrong")
        }
    }

}
