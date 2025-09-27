import {Component, inject, model, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AppService} from "../../../app.service";
import {HttpClient} from "@angular/common/http";
import * as webauthnJson from "@github/webauthn-json";

@Component({
    selector: 'register-page',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './register-page.html',
    styleUrl: './register-page.css',
    encapsulation: ViewEncapsulation.None
})
export class RegisterPage {

    email = model<string>()

    router = inject(Router);

    service = inject(AppService)

    http = inject(HttpClient)

    async onSubmit() {

        const optionsRequest = await fetch("/service/security/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: this.email()})
        })

        const credentialCreateOptions = await optionsRequest.json()

        const publicKeyCredential = await webauthnJson.create(credentialCreateOptions);

        const registerRequest = await fetch("/service/security/register/finish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username : this.email(),
                publicKeyCredential
            })
        });

        if (registerRequest.ok) {
            this.service.run(this.http).then(() => {
                this.router.navigateByUrl("/", {onSameUrlNavigation : "reload"})
            })
        } else {
            alert("Something went wrong")
        }


    }

}
