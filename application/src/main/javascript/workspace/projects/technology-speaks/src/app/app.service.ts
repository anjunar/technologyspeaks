import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {JSONDeserializer} from "shared";
import Application from "./domain/Application";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

    readonly app = signal<Application>(null)

    async run(http : HttpClient) {
        this.app.set(JSONDeserializer<Application>(await firstValueFrom(http.get('/service'))))
        return this.app()
    }

}
