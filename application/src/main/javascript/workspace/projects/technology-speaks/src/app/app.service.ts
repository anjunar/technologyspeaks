import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Application from "./domain/Application";
import {firstValueFrom} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    readonly app = signal<Application>(null)

    async run(http: HttpClient) {
        this.app.set(Application.fromJSON(await firstValueFrom(http.get('/service'))))
        return this.app()
    }

}
