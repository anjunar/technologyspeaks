import {HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {REQUEST, ServerRequest} from "../request-token";
import {isPlatformBrowser} from "@angular/common";

export const serverCookieInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (! isPlatformBrowser(platformId)) {
        const request: ServerRequest = inject(REQUEST);

        const cookieHeader = Object.entries(request.cookie)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        const modifiedReq = req.clone({
            url : `${request.protocol}://localhost${req.url}`,
            setHeaders: {
                Cookie: cookieHeader
            }
        });
        return next(modifiedReq);
    }

    return next(req)
};
