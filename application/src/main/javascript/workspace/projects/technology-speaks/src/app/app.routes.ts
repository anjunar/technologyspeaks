import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {HomePage} from "./pages/root/home-page/home-page";
import {LoginPage} from "./pages/security/login-page/login-page";
import {RootPage} from "./pages/root/root-page/root-page";
import {HttpClient} from "@angular/common/http";
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {JSONDeserializer, Mapper, traverseObjectGraph} from "shared";
import Application from "./domain/Application";
import {UsersPage} from "./pages/control/users-page/users-page";
import {UserPage} from "./pages/control/user-page/user-page";
import {AppService} from "./app.service";
import {LogoutPage} from "./pages/security/logout-page/logout-page";
import {RegisterPage} from "./pages/security/register-page/register-page";

export const routes: Routes = [
    {
        path : "",
        component : RootPage,
        resolve : {
            application : async () => {
                const service = inject(AppService);
                const http = inject(HttpClient);
                return service.run(http)
            }
        },
        children : [
            {
                path : "",
                component : HomePage,
            },
            {
                path : "security/logout",
                component : LogoutPage
            },
            {
                path : "security/login",
                component : LoginPage
            },
            {
                path : "security/register",
                component : RegisterPage
            },
            {
                path : "control/users/search",
                component : UsersPage,
                resolve : {
                    users : async (route: ActivatedRouteSnapshot) => {
                        const http = inject(HttpClient);

                        let index = route.paramMap.get("index") || 0;
                        let limit = route.paramMap.get("limit") || 5;

                        return JSONDeserializer(
                            await firstValueFrom(http.get(`/service/control/users?index=${index}&limit=${limit}`))
                        )
                    }
                }
            },
            {
                path : "control/users/user/:id",
                component : UserPage,
                resolve : {
                    user : async (route: ActivatedRouteSnapshot) => {
                        const http = inject(HttpClient);

                        let id = route.paramMap.get("id")

                        return Mapper.domain(await firstValueFrom(http.get(`/service/control/users/user/${id}`)))
                    }
                }
            }
        ]
    },
];
