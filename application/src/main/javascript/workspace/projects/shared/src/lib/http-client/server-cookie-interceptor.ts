import {HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {REQUEST} from "../request-token";
import {isPlatformBrowser} from "@angular/common";

export const serverCookieInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (! isPlatformBrowser(platformId)) {
        const request: any = inject(REQUEST);

        const modifiedReq = req.clone({
            url : `${request.protocol}://${request.host}${req.url}`,
            setHeaders: {
                Cookie: request.cookie["JSESSIONID"]
            }
        });
        return next(modifiedReq);
    }

    return next(req)
};
