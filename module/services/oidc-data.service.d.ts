import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
export declare class OidcDataService {
    private httpClient;
    constructor(httpClient: HttpClient);
    getWellknownEndpoints<T>(url: string): Observable<T>;
    getIdentityUserData<T>(url: string, token: string): Observable<T>;
    get<T>(url: string): Observable<T>;
}
