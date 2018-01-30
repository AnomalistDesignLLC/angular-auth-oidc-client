import { Observable } from 'rxjs/Observable';
import { OidcSecurityCommon } from './oidc.security.common';
import { OidcDataService } from './oidc-data.service';
import { AuthWellKnownEndpoints } from '../models/auth.well-known-endpoints';
export declare class OidcSecurityUserService {
    private oidcDataService;
    private oidcSecurityCommon;
    private userData;
    private authWellKnownEndpoints;
    constructor(oidcDataService: OidcDataService, oidcSecurityCommon: OidcSecurityCommon);
    setupModule(authWellKnownEndpoints: AuthWellKnownEndpoints): void;
    initUserData(): Observable<any>;
    getUserData(): any;
    setUserData(value: any): void;
    private getIdentityUserData();
}
