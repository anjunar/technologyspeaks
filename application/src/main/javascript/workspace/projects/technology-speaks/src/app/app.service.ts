import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {JSONDeserializer, Mapper} from "shared";
import Application from "./domain/Application";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

    readonly app = signal<Application>(null)

    async run(http : HttpClient) {
        this.app.set(Mapper.domain(await firstValueFrom(http.get('/service')), Application))
        return this.app()
    }

}
