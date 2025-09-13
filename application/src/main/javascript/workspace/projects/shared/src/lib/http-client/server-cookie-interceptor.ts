import {HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {REQUEST, ServerRequest} from "../request-token";
import {isPlatformBrowser} from "@angular/common";

export const serverCookieInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (! isPlatformBrowser(platformId)) {
        const request: ServerRequest = inject(REQUEST, {optional : true});

        const modifiedReq = req.clone({
            url : `${request ? request.protocol : "http"}://localhost${req.url}`,
            setHeaders: {
                Cookie: request ? request.cookie["JSESSIONID"] : ""
            }
        });
        return next(modifiedReq);
    }

    return next(req)
};
