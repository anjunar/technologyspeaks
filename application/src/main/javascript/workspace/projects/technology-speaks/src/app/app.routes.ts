import { Routes } from '@angular/router';
import {HomePage} from "./pages/root/home-page/home-page";
import {LoginPage} from "./pages/security/login-page/login-page";
import {RootPage} from "./pages/root/root-page/root-page";
import {HttpClient} from "@angular/common/http";
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {JSONDeserializer} from "shared";
import Application from "./domain/Application";

export const routes: Routes = [
    {
        path : "",
        component : RootPage,
        resolve : {
            application : async () => {
                const http = inject(HttpClient);
                return JSONDeserializer<Application>(await firstValueFrom(http.get('/service')))
            }
        },
        children : [
            {
                path : "home",
                component : HomePage,
            },
            {
                path : "security/login",
                component : LoginPage
            }
        ]
    },
];
