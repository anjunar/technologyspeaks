import {Component, inject, ViewEncapsulation} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AppService} from "../../../app.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'logout-page',
    imports: [
        FormsModule
    ],
  templateUrl: './logout-page.html',
  styleUrl: './logout-page.css',
    encapsulation : ViewEncapsulation.None
})
export class LogoutPage {

    router = inject(Router);

    service = inject(AppService)

    http = inject(HttpClient)

    async onSubmit() {

        const responseFinish = await fetch('/service/security/logout', { method: 'POST' })

        if (responseFinish.ok) {
            this.service.run(this.http).then(() => {
                this.router.navigateByUrl("/", {onSameUrlNavigation : "reload"})
            })
        } else {
            alert("Something went wrong")
        }
    }


}
