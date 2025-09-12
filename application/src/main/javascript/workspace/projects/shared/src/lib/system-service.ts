import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SystemService {
    private _data: any;

    constructor(private http: HttpClient) {
    }

    async loadInitialData(): Promise<void> {
        try {
            this._data = await firstValueFrom(this.http.get(`/service`));
        } catch (err) {
            console.error('Error loading data from /service', err);
            this._data = null;
        }
    }

    get data() {
        return this._data;
    }
}
