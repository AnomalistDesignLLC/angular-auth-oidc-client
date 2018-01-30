import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OidcDataService {
    constructor(private http: Http) {}

    getWellknownEndpoints<T>(url: string): Observable<Response> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');

        return this.http.get(url, {
            headers: headers
        });
    }

    getIdentityUserData<T>(url: string, token: string): Observable<Response> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append(
            'Authorization',
            'Bearer ' + decodeURIComponent(token)
        );

        return this.http.get(url, {
            headers: headers
        });
    }

    get<T>(url: string): Observable<Response> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');

        return this.http.get(url, {
            headers: headers
        });
    }
}
