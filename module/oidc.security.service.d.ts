import { EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { Router } from '@angular/router';
import { AuthConfiguration, OpenIDImplicitFlowConfiguration } from './auth.configuration';
import { OidcSecurityValidation } from './oidc.security.validation';
import { OidcSecurityCheckSession } from './oidc.security.check-session';
import { OidcSecuritySilentRenew } from './oidc.security.silent-renew';
import { OidcSecurityUserService } from './oidc.security.user-service';
import { OidcSecurityCommon } from './oidc.security.common';
import { AuthWellKnownEndpoints } from './auth.well-known-endpoints';
import { ISubscription } from 'rxjs/Subscription';
import { JwtKeys } from './jwtkeys';
/**
 * The main service of OIDC Security
 *
 * @export
 * @class OidcSecurityService
 * @property {EventEmitter<any>} onModuleSetup
 * @property {boolean} checkSessionChanged
 * @property {boolean} moduleSetup
 * @property {BehaviorSubject<boolean>} _isAuthorized
 * @property {boolean} _isAuthorizedValue
 * @property {BehaviorSubject<any>} _userData
 * @property {boolean} _userDataValue
 * @property {OidcSecurityValidation} oidcSecurityValidation
 * @property {string} errorMessage
 * @property {JwtKeys} jwtKeys
 * @property {boolean} authWellKnownEndpointsLoaded
 * @property {number} CheckForPopupClosedInterval
 * @property {any} _checkForPopupClosedTimer
 * @property {any} _popup
 * @property {string} _popupFor
 * @property {BehaviorSubject<boolean>} _isLoading
 * @property {boolean} _isLoadingValue
 * @property {any} source_mobile
 * @property {any} source_browser
 * @property {ISubscription} subscription
 * @method setupModule
 * @method getUserData
 * @method setUserData
 * @method getIsAuthorized
 * @method setIsAuthorized
 * @method getIsLoading
 * @method setIsLoading
 * @method getToken
 * @method getIdToken
 * @method getPayloadFromIdToken
 * @method setCustomRequestParameters
 * @method getRefreshSessionUrl
 * @method authorize
 * @method authorizeWithPopup
 * @method authorizeWithWebview
 * @method popup
 * @method webview
 * @method silentRenewForWebview
 * @method popup_cleanup
 * @method _checkForPopupClosed
 * @method _checkForLogoutPopupClosed
 * @method authorizedCallbackForWebview
 * @method authorizedCallbackForPopup
 * @method authorizedCallback
 * @method refreshSessionCallback
 * @method getUserinfo
 * @method logoff
 * @method successful_validation
 * @method refreshSession
 * @method refreshSessionWithWebview
 * @method setAuthorizationData
 * @method createAuthorizeUrl
 * @method getAuthorizeData
 * @method resetAuthorizationData
 * @method handleError
 * @method onCheckSessionChanged
 * @method onWellKnownEndpointsLoaded
 * @method runGetSigningKeys
 * @method getSigningKeys
 * @method extractData
 * @method handleErrorGetSigningKeys
 * @method runTokenValidationForBrowser
 * @method runTokenValidationForMobile
 */
export declare class OidcSecurityService {
    private platformId;
    private http;
    private authConfiguration;
    private router;
    private oidcSecurityCheckSession;
    private oidcSecuritySilentRenew;
    private oidcSecurityUserService;
    private oidcSecurityCommon;
    private authWellKnownEndpoints;
    /**
     * Used to store onModuleSetup
     *
     * @name onModuleSetup
     * @type {EventEmitter<any>}
     * @memberof OidcSecurityService
     */
    onModuleSetup: EventEmitter<any>;
    /**
     * Used to store checkSessionChanged
     *
     * @name checkSessionChanged
     * @type {boolean}
     * @memberof OidcSecurityService
     */
    checkSessionChanged: boolean;
    /**
     * Used to store moduleSetup
     *
     * @name moduleSetup
     * @type {boolean}
     * @memberof OidcSecurityService
     */
    moduleSetup: boolean;
    /**
     * Used to store _isAuthorized
     *
     * @name _isAuthorized
     * @private
     * @type {BehaviorSubject<boolean>}
     * @memberof OidcSecurityService
     */
    private _isAuthorized;
    /**
     * Used to store _isAuthorizedValue
     *
     * @name _isAuthorizedValue
     * @private
     * @type {boolean}
     * @memberof OidcSecurityService
     */
    private _isAuthorizedValue;
    /**
     * Used to store _userData
     *
     * @name _userData
     * @private
     * @type {BehaviorSubject<any>}
     * @memberof OidcSecurityService
     */
    private _userData;
    /**
     * Used to store _userDataValue
     *
     * @name _userDataValue
     * @private
     * @type {boolean}
     * @memberof OidcSecurityService
     */
    private _userDataValue;
    /**
     * Used to store oidcSecurityValidation
     *
     * @name oidcSecurityValidation
     * @public
     * @type {OidcSecurityValidation}
     * @memberof OidcSecurityService
     */
    oidcSecurityValidation: OidcSecurityValidation;
    /**
     * Used to store errorMessage
     *
     * @name errorMessage
     * @private
     * @type {string}
     * @memberof OidcSecurityService
     */
    private errorMessage;
    /**
     * Used to store jwtKeys
     *
     * @name jwtKeys
     * @private
     * @type {JwtKeys}
     * @memberof OidcSecurityService
     */
    private jwtKeys;
    /**
     * Used to store authWellKnownEndpointsLoaded
     *
     * @name authWellKnownEndpointsLoaded
     * @private
     * @type {boolean}
     * @memberof OidcSecurityService
     */
    private authWellKnownEndpointsLoaded;
    /**
     * Used to store CheckForPopupClosedInterval
     *
     * @name CheckForPopupClosedInterval
     * @private
     * @type {number}
     * @memberof OidcSecurityService
     */
    private CheckForPopupClosedInterval;
    /**
     * Used to store _checkForPopupClosedTimer
     *
     * @name _checkForPopupClosedTimer
     * @private
     * @type {any}
     * @memberof OidcSecurityService
     */
    private _checkForPopupClosedTimer;
    /**
     * Used to store _popup
     *
     * @name _popup
     * @private
     * @type {any}
     * @memberof OidcSecurityService
     */
    private _popup;
    /**
     * Used to store _popupFor
     *
     * @name _popupFor
     * @private
     * @type {string}
     * @memberof OidcSecurityService
     */
    private _popupFor;
    /**
     * Used to store _isLoading
     *
     * @name _isLoading
     * @private
     * @type {BehaviorSubject<boolean>}
     * @memberof OidcSecurityService
     */
    private _isLoading;
    /**
     * Used to store _isLoadingValue
     *
     * @name _isLoadingValue
     * @private
     * @type {boolean}
     * @memberof OidcSecurityService
     */
    private _isLoadingValue;
    /**
     * Used to store source_mobile
     *
     * @name source_mobile
     * @private
     * @type {any}
     * @memberof OidcSecurityService
     */
    private source_mobile;
    /**
     * Used to store source_browser
     *
     * @name source_browser
     * @private
     * @type {any}
     * @memberof OidcSecurityService
     */
    private source_browser;
    /**
     * Used to store subscription
     *
     * @name subscription
     * @type {ISubscription}
     * @memberof OidcSecurityService
     */
    subscription: ISubscription;
    /**
     * Creates an instance of OidcSecurityService.
     *
     * @constructor
     * @param {Object} platformId
     * @param {Http} http
     * @param {AuthConfiguration} authConfiguration
     * @param {Router} router
     * @param {OidcSecurityCheckSession} oidcSecurityCheckSession
     * @param {OidcSecuritySilentRenew} oidcSecuritySilentRenew
     * @param {OidcSecurityUserService} oidcSecurityUserService
     * @param {OidcSecurityCommon} oidcSecurityCommon
     * @param {AuthWellKnownEndpoints} authWellKnownEndpoints
     * @memberof OidcSecurityService
     */
    constructor(platformId: Object, http: Http, authConfiguration: AuthConfiguration, router: Router, oidcSecurityCheckSession: OidcSecurityCheckSession, oidcSecuritySilentRenew: OidcSecuritySilentRenew, oidcSecurityUserService: OidcSecurityUserService, oidcSecurityCommon: OidcSecurityCommon, authWellKnownEndpoints: AuthWellKnownEndpoints);
    /**
     * Used to setup module
     *
     * @method setupModule
     * @param {OpenIDImplicitFlowConfiguration} openIDImplicitFlowConfiguration
     * @memberof OidcSecurityService
     */
    setupModule(openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration): void;
    /**
     * Used to get user data
     *
     * @method getUserData
     * @returns {Observable<any>}
     * @memberof OidcSecurityService
     */
    getUserData(): Observable<any>;
    /**
     * Used to set user data
     *
     * @method setUserData
     * @private
     * @param {any} userData
     * @memberof OidcSecurityService
     */
    private setUserData(userData);
    /**
     * Used to get is authorized
     *
     * @method getIsAuthorized
     * @returns {Observable<boolean>}
     * @memberof OidcSecurityService
     */
    getIsAuthorized(): Observable<boolean>;
    /**
     * Used to set is authorized
     *
     * @method setIsAuthorized
     * @private
     * @param {boolean} isAuthorized
     * @memberof OidcSecurityService
     */
    private setIsAuthorized(isAuthorized);
    /**
     * Used to get is loading
     *
     * @method getIsLoading
     * @returns {Observable<boolean>}
     * @memberof OidcSecurityService
     */
    getIsLoading(): Observable<boolean>;
    /**
     * Used to set is loading
     *
     * @method setIsLoading
     * @private
     * @param {boolean} isAuthorized
     * @memberof OidcSecurityService
     */
    private setIsLoading(isAuthorized);
    /**
     * Used to get token
     *
     * @method getToken
     * @returns {any}
     * @memberof OidcSecurityService
     */
    getToken(): any;
    /**
     * Used to get id token
     *
     * @method getIdToken
     * @returns {any}
     * @memberof OidcSecurityService
     */
    getIdToken(): any;
    /**
     * Used to get payload from id token
     *
     * @method getPayloadFromIdToken
     * @param {boolean} [encode=false]
     * @returns {any}
     * @memberof OidcSecurityService
     */
    getPayloadFromIdToken(encode?: boolean): any;
    /**
     * Used to set custome request parameters
     *
     * @method setCustomRequestParameters
     * @param {({ [key: string]: string | number | boolean })} params
     * @memberof OidcSecurityService
     */
    setCustomRequestParameters(params: {
        [key: string]: string | number | boolean;
    }): void;
    /**
     * Used to get refresh session url
     *
     * @method getRefreshSessionUrl
     * @returns
     * @memberof OidcSecurityService
     */
    getRefreshSessionUrl(): string;
    /**
     * Used to authorize user
     *
     * @method authorize
     * @param {string} [authenticationScheme='local']
     * @returns
     * @memberof OidcSecurityService
     */
    authorize(authenticationScheme?: string): void;
    /**
     * Used to authorize user with popup
     *
     * @method authorizeWithPopup
     * @param {string} [authenticationScheme='local']
     * @returns
     * @memberof OidcSecurityService
     */
    authorizeWithPopup(authenticationScheme?: string): void;
    /**
     * Used to authorize use with webview
     *
     * @method authorizeWithWebview
     * @param {string} [authenticationScheme='local']
     * @returns
     * @memberof OidcSecurityService
     */
    authorizeWithWebview(authenticationScheme?: string): void;
    /**
     * Used to open popup with qis
     *
     * @method popup
     * @param {string} url
     * @param {string} title
     * @param {number} w
     * @param {number} h
     * @memberof OidcSecurityService
     */
    popup(url: string, title: string, w: number, h: number): void;
    /**
     * Used to open webview with qis
     *
     * @method webview
     * @param {string} url
     * @param {string} target
     * @param {string} [options='location=yes,status=yes']
     * @memberof OidcSecurityService
     */
    webview(url: string, target: string, options?: string): void;
    /**
     * Used to silent renew in webview
     *
     * @method silentRenewForWebview
     * @param {string} url
     * @memberof OidcSecurityService
     */
    silentRenewForWebview(url: string): void;
    /**
     * Used to cleanup popup
     *
     * @method popup_cleanup
     * @memberof OidcSecurityService
     */
    popup_cleanup(): void;
    /**
     * Used to cleanup popup at close
     *
     * @method _checkForPopupClosed
     * @memberof OidcSecurityService
     */
    _checkForPopupClosed(): void;
    /**
     * Used to logout popup close
     *
     * @method _checkForLogoutPopupClosed
     * @memberof OidcSecurityService
     */
    _checkForLogoutPopupClosed(): void;
    /**
     * The callback for authorize webview
     *
     * @method authorizedCallbackForWebview
     * @param {any} result
     * @memberof OidcSecurityService
     */
    authorizedCallbackForWebview(result: any): void;
    /**
     * The callback for authorize popup
     *
     * @method authorizedCallbackForPopup
     * @memberof OidcSecurityService
     */
    authorizedCallbackForPopup(): void;
    /**
     * The callback for authorize
     *
     * @method authorizedCallback
     * @memberof OidcSecurityService
     */
    authorizedCallback(): void;
    /**
     * The callback for refresh session
     *
     * @method refreshSessionCallback
     * @param {any} href
     * @returns
     * @memberof OidcSecurityService
     */
    refreshSessionCallback(href: any): Promise<{}>;
    /**
     * Used to get user info
     *
     * @method getUserinfo
     * @param {boolean} [isRenewProcess=false]
     * @param {any} [result]
     * @param {any} [id_token]
     * @param {any} [decoded_id_token]
     * @returns {Observable<boolean>}
     * @memberof OidcSecurityService
     */
    getUserinfo(isRenewProcess?: boolean, result?: any, id_token?: any, decoded_id_token?: any): Observable<boolean>;
    /**
     * Used to logoff
     *
     * @method logoff
     * @returns
     * @memberof OidcSecurityService
     */
    logoff(): Promise<{}>;
    /**
     * Used to when validation was succesful
     *
     * @method successful_validation
     * @memberof OidcSecurityService
     */
    successful_validation(): void;
    /**
     * Used to refresh session
     *
     * @method refreshSession
     * @returns
     * @memberof OidcSecurityService
     */
    refreshSession(): Promise<{}>;
    /**
     * Used to refresh session with webview
     *
     * @method refreshSessionWithWebview
     * @memberof OidcSecurityService
     */
    refreshSessionWithWebview(): void;
    /**
     * Used to set authorization data
     *
     * @method setAuthorizationData
     * @param {any} access_token
     * @param {any} id_token
     * @memberof OidcSecurityService
     */
    setAuthorizationData(access_token: any, id_token: any): void;
    /**
     * Used to create authorize url
     *
     * @method createAuthorizeUrl
     * @private
     * @param {string} nonce
     * @param {string} state
     * @param {string} authorization_endpoint
     * @returns {string}
     * @memberof OidcSecurityService
     */
    private createAuthorizeUrl(nonce, state, authorization_endpoint);
    /**
     * Used to get authorize data
     *
     * @method getAuthorizeData
     * @private
     * @param {string} nonce
     * @param {string} state
     * @param {string} authorization_endpoint
     * @returns {{}}
     * @memberof OidcSecurityService
     */
    private getAuthorizeData(nonce, state, authorization_endpoint);
    /**
     * Used to reset authorization data
     *
     * @method resetAuthorizationData
     * @param {boolean} isRenewProcess
     * @memberof OidcSecurityService
     */
    resetAuthorizationData(isRenewProcess: boolean): void;
    /**
     * Used to handle errors
     *
     * @method handleError
     * @param {any} error
     * @memberof OidcSecurityService
     */
    handleError(error: any): void;
    /**
     * Used to check on check session
     *
     * @method onCheckSessionChanged
     * @private
     * @memberof OidcSecurityService
     */
    private onCheckSessionChanged();
    /**
     * Used to check on well known endpoints load
     *
     * @method onWellKnownEndpointsLoaded
     * @private
     * @memberof OidcSecurityService
     */
    private onWellKnownEndpointsLoaded();
    /**
     * Used to run ge signing keys
     *
     * @method runGetSigningKeys
     * @private
     * @memberof OidcSecurityService
     */
    private runGetSigningKeys();
    /**
     * Used to get signing keys
     *
     * @method getSigningKeys
     * @returns {Observable<JwtKeys>}
     * @memberof OidcSecurityService
     */
    getSigningKeys(): Observable<JwtKeys>;
    /**
     * Used to extract data
     *
     * @method extractData
     * @private
     * @param {Response} res
     * @returns
     * @memberof OidcSecurityService
     */
    private extractData(res);
    /**
     * Used to handle error get signing keys
     *
     * @method handleErrorGetSigningKeys
     * @private
     * @param {(Response | any)} error
     * @returns
     * @memberof OidcSecurityService
     */
    private handleErrorGetSigningKeys(error);
    /**
     * Used to run token validation fro browser
     *
     * @method runTokenValidationForBrowser
     * @returns
     * @memberof OidcSecurityService
     */
    runTokenValidationForBrowser(): Promise<{}>;
    /**
     * Used to run token validation for mobile
     *
     * @method runTokenValidationForMobile
     * @returns
     * @memberof OidcSecurityService
     */
    runTokenValidationForMobile(): Promise<{}>;
}
