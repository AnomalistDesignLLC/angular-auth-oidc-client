import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';
import { AuthWellKnownEndpoints } from './auth.well-known-endpoints';
/**
 * Ther service for oidc security user
 *
 * @export
 * @class OidcSecurityUserService
 * @property {any} userData
 * @method initUserData
 * @method getIdentityUserData
 * @method handleError
 */
export declare class OidcSecurityUserService {
    private http;
    private authConfiguration;
    private oidcSecurityCommon;
    private authWellKnownEndpoints;
    /**
     * Used to store userData
     *
     * @type {any}
     * @memberof OidcSecurityUserService
     */
    userData: any;
    /**
     * Creates an instance of OidcSecurityUserService.
     *
     * @constructor
     * @param {Http} http
     * @param {AuthConfiguration} authConfiguration
     * @param {OidcSecurityCommon} oidcSecurityCommon
     * @param {AuthWellKnownEndpoints} authWellKnownEndpoints
     * @memberof OidcSecurityUserService
     */
    constructor(http: Http, authConfiguration: AuthConfiguration, oidcSecurityCommon: OidcSecurityCommon, authWellKnownEndpoints: AuthWellKnownEndpoints);
    /**
     * Used to initialize user data
     *
     * @method initUserData
     * @public
     * @returns {any}
     * @memberof OidcSecurityUserService
     */
    initUserData(): any;
    /**
     * Used to get identity user data
     *
     * @method getIdentityUserData
     * @private
     * @returns {Observable<any}
     * @memberof OidcSecurityUserService
     */
    private getIdentityUserData;
    /**
     * Used to handle errors
     *
     * @method handleError
     * @private
     * @param {any} error
     * @return {void}
     * @memberof OidcSecurityUserService
     */
    private handleError(error);
}
