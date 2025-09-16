import {HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {REQUEST, ServerRequest} from "../request-token";
import {isPlatformBrowser} from "@angular/common";
import {Router} from "@angular/router";
import {catchError, throwError} from "rxjs";

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

    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 403) {
                const currentUrl = router.url;
                router.navigate(['/security/login'], {
                    queryParams: { link: currentUrl }
                });
            }
            return throwError(() => error);
        })
    );
};
