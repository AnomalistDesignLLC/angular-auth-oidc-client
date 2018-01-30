import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
export declare class OidcDataService {
    private http;
    constructor(http: Http);
    getWellknownEndpoints<T>(url: string): Observable<Response>;
    getIdentityUserData<T>(url: string, token: string): Observable<Response>;
    get<T>(url: string): Observable<Response>;
}
