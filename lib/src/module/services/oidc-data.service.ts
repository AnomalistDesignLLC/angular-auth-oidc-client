import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OidcDataService {
    constructor(private httpClient: HttpClient) {}

    getWellknownEndpoints<T>(url: string): Observable<T> {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');

        return this.httpClient.get<T>(url, {
            headers: headers
        });
    }

    getIdentityUserData<T>(url: string, token: string): Observable<T> {
        const headers = new HttpHeaders({'Accept': 'application/json', 'Authorization': 'Bearer ' + decodeURIComponent(token)});
        console.log(headers);

        return this.httpClient.get<T>(url, {
            headers: headers
        });
    }

    get<T>(url: string): Observable<T> {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');

        return this.httpClient.get<T>(url, {
            headers: headers
        });
    }
}
