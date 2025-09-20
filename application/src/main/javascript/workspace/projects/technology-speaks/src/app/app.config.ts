import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {JodaDateTimeValueAccessor, JodaDateValueAccessor, serverCookieInterceptor} from "shared";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
        // provideClientHydration(withEventReplay()),
        provideHttpClient(
            withInterceptors([serverCookieInterceptor]),
            withFetch()
        ),
        {
            provide: NG_VALUE_ACCESSOR,
            useClass: JodaDateTimeValueAccessor,
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useClass: JodaDateValueAccessor,
            multi: true
        }
    ]
}
