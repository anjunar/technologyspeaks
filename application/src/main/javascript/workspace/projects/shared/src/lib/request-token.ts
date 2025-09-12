import { InjectionToken } from '@angular/core';

export interface ServerRequest {
    document : string
    protocol : string
    host : string
    path : string
    search : string
    language : string
    cookie : { key : string, value : string }
}

export const REQUEST = new InjectionToken<ServerRequest>('REQUEST');
