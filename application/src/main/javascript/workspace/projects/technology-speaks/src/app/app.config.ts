import {
    APP_INITIALIZER,
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
    PLATFORM_ID, Injector, APP_BOOTSTRAP_LISTENER
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {REQUEST, serverCookieInterceptor, SystemService} from "shared";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes), provideClientHydration(withEventReplay()),
        provideHttpClient(
            withInterceptors([serverCookieInterceptor]),
            withFetch()
        ),
        SystemService,
        {
            provide: APP_BOOTSTRAP_LISTENER,
            useFactory: (platformId: Object, systemService: SystemService, injector: Injector) => {
                const isRequestAvailable = injector.get(REQUEST, null);
                if (isPlatformBrowser(platformId) || isRequestAvailable) {
                    return () => systemService.loadInitialData();
                }
                return () => Promise.resolve();
            },
            deps: [PLATFORM_ID, SystemService, Injector],
            multi: true
        }
    ]
};
