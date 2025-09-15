import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {serverCookieInterceptor} from "shared";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideClientHydration(withEventReplay()),
        provideHttpClient(
            withInterceptors([serverCookieInterceptor]),
            withFetch()
        )
    ]
}
