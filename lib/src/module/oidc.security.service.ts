/**
 * Provides a single interface for the OidcSecurityService to be used in other modules
 * 
 * @file oidc.security.service
 * @author Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 * @license MIT
 * @copyright 2017 Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 */

/**
 * Dependencies
 * 
 * @import
 */
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
@Injectable()
export class OidcSecurityService {

  /**
   * Used to store onModuleSetup
   * 
   * @name onModuleSetup
   * @type {EventEmitter<any>}
   * @memberof OidcSecurityService
   */
  @Output() onModuleSetup: EventEmitter<any> = new EventEmitter<any>(true);

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
  private _isAuthorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Used to store _isAuthorizedValue
   * 
   * @name _isAuthorizedValue
   * @private
   * @type {boolean}
   * @memberof OidcSecurityService
   */
  private _isAuthorizedValue: boolean;

  /**
   * Used to store _userData
   * 
   * @name _userData
   * @private
   * @type {BehaviorSubject<any>}
   * @memberof OidcSecurityService
   */
  private _userData: BehaviorSubject<any> = new BehaviorSubject<any>('');

  /**
   * Used to store _userDataValue
   * 
   * @name _userDataValue
   * @private
   * @type {boolean}
   * @memberof OidcSecurityService
   */
  private _userDataValue: boolean;

  /**
   * Used to store oidcSecurityValidation
   * 
   * @name oidcSecurityValidation
   * @public
   * @type {OidcSecurityValidation}
   * @memberof OidcSecurityService
   */
  public oidcSecurityValidation: OidcSecurityValidation;

  /**
   * Used to store errorMessage
   * 
   * @name errorMessage
   * @private
   * @type {string}
   * @memberof OidcSecurityService
   */
  private errorMessage: string;

  /**
   * Used to store jwtKeys
   * 
   * @name jwtKeys
   * @private
   * @type {JwtKeys}
   * @memberof OidcSecurityService
   */
  private jwtKeys: JwtKeys;

  /**
   * Used to store authWellKnownEndpointsLoaded
   * 
   * @name authWellKnownEndpointsLoaded
   * @private
   * @type {boolean}
   * @memberof OidcSecurityService
   */
  private authWellKnownEndpointsLoaded: boolean;

  /**
   * Used to store CheckForPopupClosedInterval
   * 
   * @name CheckForPopupClosedInterval
   * @private
   * @type {number}
   * @memberof OidcSecurityService
   */
  private CheckForPopupClosedInterval: number;

  /**
   * Used to store _checkForPopupClosedTimer
   * 
   * @name _checkForPopupClosedTimer
   * @private
   * @type {any}
   * @memberof OidcSecurityService
   */
  private _checkForPopupClosedTimer: any;

  /**
   * Used to store _popup
   * 
   * @name _popup
   * @private
   * @type {any}
   * @memberof OidcSecurityService
   */
  private _popup: any;

  /**
   * Used to store _popupFor
   * 
   * @name _popupFor
   * @private
   * @type {string}
   * @memberof OidcSecurityService
   */
  private _popupFor: string;
  
  /**
   * Used to store _isLoading
   * 
   * @name _isLoading
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof OidcSecurityService
   */
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Used to store _isLoadingValue
   * 
   * @name _isLoadingValue
   * @private
   * @type {boolean}
   * @memberof OidcSecurityService
   */
  private _isLoadingValue: boolean;

  /**
   * Used to store source_mobile
   * 
   * @name source_mobile
   * @private
   * @type {any}
   * @memberof OidcSecurityService
   */
  private source_mobile: any = Observable.timer(30000, 30000)
    .timeInterval()
    .pluck('interval')
    .take(10000);

  /**
   * Used to store source_browser
   * 
   * @name source_browser
   * @private
   * @type {any}
   * @memberof OidcSecurityService
   */
  private source_browser: any = Observable.timer(3000, 3000)
    .timeInterval()
    .pluck('interval')
    .take(10000);

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
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: Http,
    private authConfiguration: AuthConfiguration,
    private router: Router,
    private oidcSecurityCheckSession: OidcSecurityCheckSession,
    private oidcSecuritySilentRenew: OidcSecuritySilentRenew,
    private oidcSecurityUserService: OidcSecurityUserService,
    private oidcSecurityCommon: OidcSecurityCommon,
    private authWellKnownEndpoints: AuthWellKnownEndpoints
  ) {}

  /**
   * Used to setup module
   * 
   * @method setupModule
   * @param {OpenIDImplicitFlowConfiguration} openIDImplicitFlowConfiguration 
   * @memberof OidcSecurityService
   */
  setupModule(openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration) {

    this.authConfiguration.init(openIDImplicitFlowConfiguration);
    this.oidcSecurityValidation = new OidcSecurityValidation(this.oidcSecurityCommon);

    this.oidcSecurityCheckSession.onCheckSessionChanged.subscribe(() => { this.onCheckSessionChanged(); });
    this.authWellKnownEndpoints.onWellKnownEndpointsLoaded.subscribe(() => { this.onWellKnownEndpointsLoaded(); });

    this.oidcSecurityCommon.setupModule();

    if (this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_user_data) !== '') {
      this.setUserData(this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_user_data));
    }

    if (this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_is_authorized) !== '') {
      this.setIsAuthorized(this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_is_authorized));
    }

    this.oidcSecurityCommon.logDebug('STS server: ' + this.authConfiguration.stsServer);

    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      this.authWellKnownEndpoints.setupModule();

      if (this.authConfiguration.silent_renew) {
        this.oidcSecuritySilentRenew.initRenew();
      }

      if (this.authConfiguration.start_checksession) {
        this.oidcSecurityCheckSession.init().subscribe(() => {
          this.oidcSecurityCheckSession.pollServerSession(this.authConfiguration.client_id);
        });
      }
    }

    this.moduleSetup = true;
    this.onModuleSetup.emit();
  }

  /**
   * Used to get user data
   * 
   * @method getUserData
   * @returns {Observable<any>} 
   * @memberof OidcSecurityService
   */
  getUserData(): Observable<any> {
    return this._userData.asObservable();
  }

  /**
   * Used to set user data
   * 
   * @method setUserData
   * @private
   * @param {any} userData 
   * @memberof OidcSecurityService
   */
  private setUserData(userData: any) {
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_user_data, userData);
    this._userData.next(userData);
  }

  /**
   * Used to get is authorized
   * 
   * @method getIsAuthorized
   * @returns {Observable<boolean>} 
   * @memberof OidcSecurityService
   */
  getIsAuthorized(): Observable<boolean> {
    return this._isAuthorized.asObservable();
  }

  /**
   * Used to set is authorized
   * 
   * @method setIsAuthorized
   * @private
   * @param {boolean} isAuthorized 
   * @memberof OidcSecurityService
   */
  private setIsAuthorized(isAuthorized: boolean) {
    this._isAuthorizedValue = isAuthorized;
    this._isAuthorized.next(isAuthorized);
  }

  /**
   * Used to get is loading
   * 
   * @method getIsLoading
   * @returns {Observable<boolean>} 
   * @memberof OidcSecurityService
   */
  getIsLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  /**
   * Used to set is loading
   * 
   * @method setIsLoading
   * @private
   * @param {boolean} isAuthorized 
   * @memberof OidcSecurityService
   */
  private setIsLoading(isAuthorized: boolean) {
    this._isLoadingValue = isAuthorized;
    this._isLoading.next(isAuthorized);
  }

  /**
   * Used to get token
   * 
   * @method getToken
   * @returns {any} 
   * @memberof OidcSecurityService
   */
  getToken(): any {
    if (!this._isAuthorizedValue) {
      return '';
    }

    const token = this.oidcSecurityCommon.getAccessToken();
    return decodeURIComponent(token);
  }

  /**
   * Used to get id token
   * 
   * @method getIdToken
   * @returns {any} 
   * @memberof OidcSecurityService
   */
  getIdToken(): any {
    if (!this._isAuthorizedValue) {
      return '';
    }

    const token = this.oidcSecurityCommon.getIdToken();
    return decodeURIComponent(token);
  }
  
  /**
   * Used to get payload from id token
   * 
   * @method getPayloadFromIdToken
   * @param {boolean} [encode=false] 
   * @returns {any} 
   * @memberof OidcSecurityService
   */
  getPayloadFromIdToken(encode = false): any {
    const token = this.getIdToken();
    return this.oidcSecurityValidation.getPayloadFromToken(token, encode);
  }

  /**
   * Used to set custome request parameters
   * 
   * @method setCustomRequestParameters
   * @param {({ [key: string]: string | number | boolean })} params 
   * @memberof OidcSecurityService
   */
  setCustomRequestParameters(params: { [key: string]: string | number | boolean }) {
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_custom_request_params, params);
  }

  /**
   * Used to get refresh session url
   * 
   * @method getRefreshSessionUrl
   * @returns 
   * @memberof OidcSecurityService
   */
  getRefreshSessionUrl() {

    const data = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_well_known_endpoints);
    if (data && data !== '') {
      this.authWellKnownEndpointsLoaded = true;
    }

    if (!this.authWellKnownEndpointsLoaded) {
      this.oidcSecurityCommon.logError('Well known endpoints must be loaded before user can login!')
      return;
    }

    if (!this.oidcSecurityValidation.config_validate_response_type(this.authConfiguration.response_type)) {
      // invalid response_type
      return
    }

    this.oidcSecurityCommon.logDebug('BEGIN Authorize, no auth data');

    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, state);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, nonce);
    this.oidcSecurityCommon.logDebug('AuthorizedController created. local state: ' + this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control));

    const url = this.createAuthorizeUrl(nonce, state, this.authWellKnownEndpoints.authorization_endpoint);

    return url;

  }

  /**
   * Used to authorize user
   * 
   * @method authorize
   * @param {string} [authenticationScheme='local'] 
   * @returns 
   * @memberof OidcSecurityService
   */
  authorize(authenticationScheme: string = 'local') {
    const data = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_well_known_endpoints);
    if (data && data !== '') {
      this.authWellKnownEndpointsLoaded = true;
    }

    if (!this.authWellKnownEndpointsLoaded) {
      this.oidcSecurityCommon.logError('Well known endpoints must be loaded before user can login!')
      return;
    }

    if (!this.oidcSecurityValidation.config_validate_response_type(this.authConfiguration.response_type)) {
      // invalid response_type
      return
    }

    this.resetAuthorizationData(false);

    this.oidcSecurityCommon.logDebug('BEGIN Authorize, no auth data');

    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, state);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, nonce);
    this.oidcSecurityCommon.logDebug('AuthorizedController created. local state: ' + this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control));

    let url = this.createAuthorizeUrl(nonce, state, this.authWellKnownEndpoints.authorization_endpoint);
    url = url + '&authenticationScheme=' + authenticationScheme;
    window.location.href = url;
  }

  /**
   * Used to authorize user with popup
   * 
   * @method authorizeWithPopup
   * @param {string} [authenticationScheme='local'] 
   * @returns 
   * @memberof OidcSecurityService
   */
  authorizeWithPopup(authenticationScheme: string = 'local') {
    this._popupFor = 'login';
    const data = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_well_known_endpoints);
    if (data && data !== '') {
      this.authWellKnownEndpointsLoaded = true;
    }

    if (!this.authWellKnownEndpointsLoaded) {
      this.oidcSecurityCommon.logError('Well known endpoints must be loaded before user can login!')
      return;
    }

    if (!this.oidcSecurityValidation.config_validate_response_type(this.authConfiguration.response_type)) {
      // invalid response_type
      return
    }

    this.resetAuthorizationData(false);

    this.oidcSecurityCommon.logDebug('BEGIN Authorize, no auth data');

    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, state);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, nonce);
    this.oidcSecurityCommon.logDebug('AuthorizedController created. local state: ' + this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control));

    let url = this.createAuthorizeUrl(nonce, state, this.authWellKnownEndpoints.authorization_endpoint);

    url = url + '&authenticationScheme=' + authenticationScheme;

    if (this._popupFor === 'afterRegistration') {
      this._popup.location.href = url;
    } else {
      this.popup(url, 'QPONS\' AUTHORIZATION PAGE', 800, 800);
    }
  }

  /**
   * Used to authorize use with webview
   * 
   * @method authorizeWithWebview
   * @param {string} [authenticationScheme='local'] 
   * @returns 
   * @memberof OidcSecurityService
   */
  authorizeWithWebview(authenticationScheme: string = 'local') {
    this._popupFor = 'login';
    const data = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_well_known_endpoints);
    if (data && data !== '') {
      this.authWellKnownEndpointsLoaded = true;
    }

    if (!this.authWellKnownEndpointsLoaded) {
      this.oidcSecurityCommon.logError('Well known endpoints must be loaded before user can login!')
      return;
    }

    if (!this.oidcSecurityValidation.config_validate_response_type(this.authConfiguration.response_type)) {
      // invalid response_type
      return
    }

    this.resetAuthorizationData(false);

    this.oidcSecurityCommon.logDebug('BEGIN Authorize, no auth data');

    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, state);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, nonce);
    this.oidcSecurityCommon.logDebug('AuthorizedController created. local state: ' + this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control));

    let url = this.createAuthorizeUrl(nonce, state, this.authWellKnownEndpoints.authorization_endpoint);

    url = url + '&authenticationScheme=' + authenticationScheme;

    if (this._popupFor === 'afterRegistration') {
      this._popup.location.href = url;
    } else {
      this.webview(url, '_blank');
    }
  }

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
  popup(url: string, title: string, w: number, h: number) {
    let options: string;
    this.CheckForPopupClosedInterval = 2000;

    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : 0;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : 0;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;

    const left = ((width / 2) - (w / 2)) + dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;

    options += 'toolbar=no,location=no,directories=no,status=no';
    options += ',menubar=no,scrollbars=no,resizable=no,copyhistory=no';

    options += ',width='  + w;
    options += ',height=' + h;
    options += ',top='  + top;
    options += ',left='   + left;

    this._popup = window.open(url, title, options);
    if (this._popupFor === 'login') {
    this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), this.CheckForPopupClosedInterval);
    } else if (this._popupFor === 'logout') {
    this._checkForPopupClosedTimer = window.setInterval(this._checkForLogoutPopupClosed.bind(this), this.CheckForPopupClosedInterval);
    }
  }

  /**
   * Used to open webview with qis
   * 
   * @method webview
   * @param {string} url 
   * @param {string} target 
   * @param {string} [options='location=yes,status=yes'] 
   * @memberof OidcSecurityService
   */
  webview(url: string, target: string, options: string = 'location=yes,status=yes') {
    this.CheckForPopupClosedInterval = 2000;

    this._popup = window.open(url, target, options);
    this._popup.addEventListener('loadstart', (event: any) => { 
      const _url = event.url;
      let a = _url.split('/');
      a = a[(a.length - 1)];
      if (_url.indexOf('#') !== '-1') {
        const hash = url.split('#')[1];    
        const result: any = hash.split('&').reduce(function (res: any, item: string) {
          const parts = item.split('=');
          res[parts[0]] = parts[1];
          return res;
        }, {});
        if (result.id_token !== undefined) {
          this._popup.close();
          this.authorizedCallbackForWebview(result);
        }
      }
      if (a === 'login') {
        this.authorizeWithWebview();
      }
    });
  }
  
  /**
   * Used to silent renew in webview
   * 
   * @method silentRenewForWebview
   * @param {string} url 
   * @memberof OidcSecurityService
   */
  silentRenewForWebview(url: string) {
    this.CheckForPopupClosedInterval = 2000;
    this._popup = window.open(url, '_blank', 'hidden=yes');
    this._popup.addEventListener('loadstart', (event: any) => { 
      const _url = event.url;
      let a = _url.split('/');
      a = a[(a.length - 1)];
      if (_url.indexOf('#') !== '-1') {
        this._popup.close();
        this.authorizedCallbackForWebview(_url);
      }
      if (a === 'login') {
        this.authorizeWithWebview();
      }
    });
  }

  /**
   * Used to cleanup popup
   * 
   * @method popup_cleanup
   * @memberof OidcSecurityService
   */
  popup_cleanup() {

    window.clearInterval(this._checkForPopupClosedTimer);
    this._checkForPopupClosedTimer = null;
    this._popup = null;

  }

  /**
   * Used to cleanup popup at close
   * 
   * @method _checkForPopupClosed
   * @memberof OidcSecurityService
   */
  _checkForPopupClosed() {
    try {
      if (this._popup.location.href !== 'about:blank' && this._popup.location.href !== undefined) {
        let a = this._popup.location.href.split('/');
        a = a[(a.length - 1)];
        if (a !== 'login') {
        this._popup.close();
        if (!this._popup || this._popup.closed) {
            this.authorizedCallbackForPopup();
            this.popup_cleanup();
        }
        } else {
        if (!this._popup || this._popup.closed) {
          this.popup_cleanup();
        } else {
          this._popupFor = 'afterRegistration';
          this.authorizeWithPopup();
        }
        }

      }
    } catch (err) {

    }
  }

  /**
   * Used to logout popup close
   * 
   * @method _checkForLogoutPopupClosed
   * @memberof OidcSecurityService
   */
  _checkForLogoutPopupClosed() {
    try {
      if (this._popup.location.href !== 'about:blank') {
        this._popup.close();
        if (!this._popup || this._popup.closed) {
          this.popup_cleanup();
        }
      }
    } catch (err) {

    }
  }

  /**
   * The callback for authorize webview
   * 
   * @method authorizedCallbackForWebview
   * @param {any} result 
   * @memberof OidcSecurityService
   */
  authorizedCallbackForWebview(result: any) {
    this.setIsLoading(true);
    const silentRenew = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_silent_renew_running);
    const isRenewProcess = (silentRenew === 'running');

    this.oidcSecurityCommon.logDebug('BEGIN authorizedCallback, no auth data');
    this.resetAuthorizationData(isRenewProcess);

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_result, result);

    this.oidcSecurityCommon.logDebug(result);
    this.oidcSecurityCommon.logDebug('authorizedCallback created, begin token validation');

    let access_token = '';
    let id_token = '';
    let authResponseIsValid = false;
    let decoded_id_token: any;

    this.getSigningKeys()
      .subscribe(jwtKeys => {
        this.jwtKeys = jwtKeys;

        if (!result.error) {

          // validate state
          if (this.oidcSecurityValidation.validateStateFromHashCallback(result.state, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control))) {
            if (this.authConfiguration.response_type === 'id_token token') {
              access_token = result.access_token;
            }
            id_token = result.id_token;

            let headerDecoded;
            decoded_id_token = this.oidcSecurityValidation.getPayloadFromToken(id_token, false);
            headerDecoded = this.oidcSecurityValidation.getHeaderFromToken(id_token, false);

            // validate jwt signature
            if (this.oidcSecurityValidation.validate_signature_id_token(id_token, this.jwtKeys)) {
              // validate nonce
              if (this.oidcSecurityValidation.validate_id_token_nonce(decoded_id_token, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_nonce))) {
                // validate required fields id_token
                if (this.oidcSecurityValidation.validate_required_id_token(decoded_id_token)) {
                  // validate max offset from the id_token issue to now
                  if (this.oidcSecurityValidation.validate_id_token_iat_max_offset(decoded_id_token, this.authConfiguration.max_id_token_iat_offset_allowed_in_seconds)) {
                    // validate iss
                    if (this.oidcSecurityValidation.validate_id_token_iss(decoded_id_token, this.authWellKnownEndpoints.issuer)) {
                      // validate aud
                      if (this.oidcSecurityValidation.validate_id_token_aud(decoded_id_token, this.authConfiguration.client_id)) {
                        // validate_id_token_exp_not_expired
                        if (this.oidcSecurityValidation.validate_id_token_exp_not_expired(decoded_id_token)) {
                          // flow id_token token
                          if (this.authConfiguration.response_type === 'id_token token') {
                            // valiadate at_hash and access_token
                            if (this.oidcSecurityValidation.validate_id_token_at_hash(access_token, decoded_id_token.at_hash) || !access_token) {
                              authResponseIsValid = true;
                              this.successful_validation();
                            } else {
                              this.oidcSecurityCommon.logWarning('authorizedCallback incorrect at_hash');
                            }
                          } else {
                            authResponseIsValid = true;
                            this.successful_validation();
                          }
                        } else {
                          this.oidcSecurityCommon.logWarning('authorizedCallback token expired');
                        }
                      } else {
                        this.oidcSecurityCommon.logWarning('authorizedCallback incorrect aud');
                      }
                    } else {
                      this.oidcSecurityCommon.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');
                    }
                  } else {
                    this.oidcSecurityCommon.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');
                  }
                } else {
                  this.oidcSecurityCommon.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');
                }
              } else {
                this.oidcSecurityCommon.logWarning('authorizedCallback incorrect nonce');
              }
            } else {
              this.oidcSecurityCommon.logDebug('authorizedCallback Signature validation failed id_token');
            }
          } else {
            this.oidcSecurityCommon.logWarning('authorizedCallback incorrect state');
          }
        }

        this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_silent_renew_running, '');

        if (authResponseIsValid) {
          this.setAuthorizationData(access_token, id_token);
          if (this.authConfiguration.auto_userinfo) {
            this.getUserinfo(isRenewProcess, result, id_token, decoded_id_token).subscribe((response) => {
              if (response) {
                this.setIsLoading(false);
                this.router.navigate([this.authConfiguration.startup_route]);
              } else {
                this.setIsLoading(false);
              }
            });
          } else {
            this.setIsLoading(false);
            this.router.navigate([this.authConfiguration.startup_route]);
          }
        } else { // some went wrong
          this.oidcSecurityCommon.logDebug('authorizedCallback, token(s) validation failed, resetting');
          this.resetAuthorizationData(false);
          this.setIsLoading(false);
          this.router.navigate([this.authConfiguration.unauthorized_route]);
        }
      });
  }

  /**
   * The callback for authorize popup
   * 
   * @method authorizedCallbackForPopup
   * @memberof OidcSecurityService
   */
  authorizedCallbackForPopup() {
    this.setIsLoading(true);
    const silentRenew = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_silent_renew_running);
    const isRenewProcess = (silentRenew === 'running');

    this.oidcSecurityCommon.logDebug('BEGIN authorizedCallback, no auth data');
    this.resetAuthorizationData(isRenewProcess);

    const hash = this._popup.location.hash.substr(1);

    const result: any = hash.split('&').reduce(function (res: any, item: string) {
      const parts = item.split('=');
      res[parts[0]] = parts[1];
      return res;
    }, {});

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_result, result);

    this.oidcSecurityCommon.logDebug(result);
    this.oidcSecurityCommon.logDebug('authorizedCallback created, begin token validation');

    let access_token = '';
    let id_token = '';
    let authResponseIsValid = false;
    let decoded_id_token: any;

    this.getSigningKeys()
      .subscribe(jwtKeys => {
        this.jwtKeys = jwtKeys;

        if (!result.error) {

          // validate state
          if (this.oidcSecurityValidation.validateStateFromHashCallback(result.state, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control))) {
            if (this.authConfiguration.response_type === 'id_token token') {
              access_token = result.access_token;
            }
            id_token = result.id_token;

            let headerDecoded;
            decoded_id_token = this.oidcSecurityValidation.getPayloadFromToken(id_token, false);
            headerDecoded = this.oidcSecurityValidation.getHeaderFromToken(id_token, false);

            // validate jwt signature
            if (this.oidcSecurityValidation.validate_signature_id_token(id_token, this.jwtKeys)) {
              // validate nonce
              if (this.oidcSecurityValidation.validate_id_token_nonce(decoded_id_token, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_nonce))) {
                // validate required fields id_token
                if (this.oidcSecurityValidation.validate_required_id_token(decoded_id_token)) {
                  // validate max offset from the id_token issue to now
                  if (this.oidcSecurityValidation.validate_id_token_iat_max_offset(decoded_id_token, this.authConfiguration.max_id_token_iat_offset_allowed_in_seconds)) {
                    // validate iss
                    if (this.oidcSecurityValidation.validate_id_token_iss(decoded_id_token, this.authWellKnownEndpoints.issuer)) {
                      // validate aud
                      if (this.oidcSecurityValidation.validate_id_token_aud(decoded_id_token, this.authConfiguration.client_id)) {
                        // validate_id_token_exp_not_expired
                        if (this.oidcSecurityValidation.validate_id_token_exp_not_expired(decoded_id_token)) {
                          // flow id_token token
                          if (this.authConfiguration.response_type === 'id_token token') {
                            // valiadate at_hash and access_token
                            if (this.oidcSecurityValidation.validate_id_token_at_hash(access_token, decoded_id_token.at_hash) || !access_token) {
                              authResponseIsValid = true;
                              this.successful_validation();
                            } else {
                              this.oidcSecurityCommon.logWarning('authorizedCallback incorrect at_hash');
                            }
                          } else {
                            authResponseIsValid = true;
                            this.successful_validation();
                          }
                        } else {
                          this.oidcSecurityCommon.logWarning('authorizedCallback token expired');
                        }
                      } else {
                        this.oidcSecurityCommon.logWarning('authorizedCallback incorrect aud');
                      }
                    } else {
                      this.oidcSecurityCommon.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');
                    }
                  } else {
                    this.oidcSecurityCommon.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');
                  }
                } else {
                  this.oidcSecurityCommon.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');
                }
              } else {
                this.oidcSecurityCommon.logWarning('authorizedCallback incorrect nonce');
              }
            } else {
              this.oidcSecurityCommon.logDebug('authorizedCallback Signature validation failed id_token');
            }
          } else {
            this.oidcSecurityCommon.logWarning('authorizedCallback incorrect state');
          }
        }

        this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_silent_renew_running, '');

        if (authResponseIsValid) {
          this.setAuthorizationData(access_token, id_token);
          if (this.authConfiguration.auto_userinfo) {
            this.getUserinfo(isRenewProcess, result, id_token, decoded_id_token).subscribe((response) => {
              if (response) {
                this.setIsLoading(false);
                this.router.navigate([this.authConfiguration.startup_route]);
              } else {
                this.setIsLoading(false);
              }
            });
          } else {
            this.setIsLoading(false);
            this.router.navigate([this.authConfiguration.startup_route]);
          }
        } else { // some went wrong
          this.oidcSecurityCommon.logDebug('authorizedCallback, token(s) validation failed, resetting');
          this.resetAuthorizationData(false);
          this.setIsLoading(false);
          this.router.navigate([this.authConfiguration.unauthorized_route]);
        }
      });
  }

  /**
   * The callback for authorize
   * 
   * @method authorizedCallback
   * @memberof OidcSecurityService
   */
  authorizedCallback() {
    const silentRenew = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_silent_renew_running);
    const isRenewProcess = (silentRenew === 'running');

    this.oidcSecurityCommon.logDebug('BEGIN authorizedCallback, no auth data');
    this.resetAuthorizationData(isRenewProcess);

    const hash = window.location.hash.substr(1);

    const result: any = hash.split('&').reduce(function (res: any, item: string) {
      const parts = item.split('=');
      res[parts[0]] = parts[1];
      return res;
    }, {});

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_result, result);

    this.oidcSecurityCommon.logDebug(result);
    this.oidcSecurityCommon.logDebug('authorizedCallback created, begin token validation');

    let access_token = '';
    let id_token = '';
    let authResponseIsValid = false;
    let decoded_id_token: any;

    this.getSigningKeys()
      .subscribe(jwtKeys => {
        this.jwtKeys = jwtKeys;

        if (!result.error) {

          // validate state
          if (this.oidcSecurityValidation.validateStateFromHashCallback(result.state, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control))) {
            if (this.authConfiguration.response_type === 'id_token token') {
              access_token = result.access_token;
            }
            id_token = result.id_token;

            let headerDecoded;
            decoded_id_token = this.oidcSecurityValidation.getPayloadFromToken(id_token, false);
            headerDecoded = this.oidcSecurityValidation.getHeaderFromToken(id_token, false);

            // validate jwt signature
            if (this.oidcSecurityValidation.validate_signature_id_token(id_token, this.jwtKeys)) {
              // validate nonce
              if (this.oidcSecurityValidation.validate_id_token_nonce(decoded_id_token, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_nonce))) {
                // validate required fields id_token
                if (this.oidcSecurityValidation.validate_required_id_token(decoded_id_token)) {
                  // validate max offset from the id_token issue to now
                  if (this.oidcSecurityValidation.validate_id_token_iat_max_offset(decoded_id_token, this.authConfiguration.max_id_token_iat_offset_allowed_in_seconds)) {
                    // validate iss
                    if (this.oidcSecurityValidation.validate_id_token_iss(decoded_id_token, this.authWellKnownEndpoints.issuer)) {
                      // validate aud
                      if (this.oidcSecurityValidation.validate_id_token_aud(decoded_id_token, this.authConfiguration.client_id)) {
                        // validate_id_token_exp_not_expired
                        if (this.oidcSecurityValidation.validate_id_token_exp_not_expired(decoded_id_token)) {
                          // flow id_token token
                          if (this.authConfiguration.response_type === 'id_token token') {
                            // valiadate at_hash and access_token
                            if (this.oidcSecurityValidation.validate_id_token_at_hash(access_token, decoded_id_token.at_hash) || !access_token) {
                              authResponseIsValid = true;
                              this.successful_validation();
                            } else {
                              this.oidcSecurityCommon.logWarning('authorizedCallback incorrect at_hash');
                            }
                          } else {
                            authResponseIsValid = true;
                            this.successful_validation();
                          }
                        } else {
                          this.oidcSecurityCommon.logWarning('authorizedCallback token expired');
                        }
                      } else {
                        this.oidcSecurityCommon.logWarning('authorizedCallback incorrect aud');
                      }
                    } else {
                      this.oidcSecurityCommon.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');
                    }
                  } else {
                    this.oidcSecurityCommon.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');
                  }
                } else {
                  this.oidcSecurityCommon.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');
                }
              } else {
                this.oidcSecurityCommon.logWarning('authorizedCallback incorrect nonce');
              }
            } else {
              this.oidcSecurityCommon.logDebug('authorizedCallback Signature validation failed id_token');
            }
          } else {
            this.oidcSecurityCommon.logWarning('authorizedCallback incorrect state');
          }
        }

        this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_silent_renew_running, '');

        if (authResponseIsValid) {
          this.setAuthorizationData(access_token, id_token);
          if (this.authConfiguration.auto_userinfo) {
            this.getUserinfo(isRenewProcess, result, id_token, decoded_id_token).subscribe((response) => {
              if (response) {
                this.router.navigate([this.authConfiguration.startup_route]);
              } else {
              }
            });
          } else {
            this.router.navigate([this.authConfiguration.startup_route]);
          }
        } else { // some went wrong
          this.oidcSecurityCommon.logDebug('authorizedCallback, token(s) validation failed, resetting');
          this.resetAuthorizationData(false);
          this.router.navigate([this.authConfiguration.unauthorized_route]);
        }
      });
  }

  /**
   * The callback for refresh session
   * 
   * @method refreshSessionCallback
   * @param {any} href 
   * @returns 
   * @memberof OidcSecurityService
   */
  refreshSessionCallback(href: any) {
    return new Promise((resolve, reject) => {
    const silentRenew = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_silent_renew_running);
    const isRenewProcess = (silentRenew === 'running');

    this.oidcSecurityCommon.logDebug('BEGIN authorizedCallback, no auth data');
    this.resetAuthorizationData(isRenewProcess);

    const hash = href;

    const result: any = hash.split('&').reduce(function (res: any, item: string) {
      const parts = item.split('=');
      res[parts[0]] = parts[1];
      return res;
    }, {});

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_result, result);

    this.oidcSecurityCommon.logDebug(result);
    this.oidcSecurityCommon.logDebug('authorizedCallback created, begin token validation');

    let access_token = '';
    let id_token = '';
    let authResponseIsValid = false;
    let decoded_id_token: any;

    this.getSigningKeys()
      .subscribe(jwtKeys => {
        this.jwtKeys = jwtKeys;

        if (!result.error) {

          // validate state
          if (this.oidcSecurityValidation.validateStateFromHashCallback(result.state, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control))) {
            if (this.authConfiguration.response_type === 'id_token token') {
              access_token = result.access_token;
            }
            id_token = result.id_token;

            let headerDecoded;
            decoded_id_token = this.oidcSecurityValidation.getPayloadFromToken(id_token, false);
            headerDecoded = this.oidcSecurityValidation.getHeaderFromToken(id_token, false);

            // validate jwt signature
            if (this.oidcSecurityValidation.validate_signature_id_token(id_token, this.jwtKeys)) {
              // validate nonce
              if (this.oidcSecurityValidation.validate_id_token_nonce(decoded_id_token, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_nonce))) {
                // validate required fields id_token
                if (this.oidcSecurityValidation.validate_required_id_token(decoded_id_token)) {
                  // validate max offset from the id_token issue to now
                  if (this.oidcSecurityValidation.validate_id_token_iat_max_offset(decoded_id_token, this.authConfiguration.max_id_token_iat_offset_allowed_in_seconds)) {
                    // validate iss
                    if (this.oidcSecurityValidation.validate_id_token_iss(decoded_id_token, this.authWellKnownEndpoints.issuer)) {
                      // validate aud
                      if (this.oidcSecurityValidation.validate_id_token_aud(decoded_id_token, this.authConfiguration.client_id)) {
                        // validate_id_token_exp_not_expired
                        if (this.oidcSecurityValidation.validate_id_token_exp_not_expired(decoded_id_token)) {
                          // flow id_token token
                          if (this.authConfiguration.response_type === 'id_token token') {
                            // valiadate at_hash and access_token
                            if (this.oidcSecurityValidation.validate_id_token_at_hash(access_token, decoded_id_token.at_hash) || !access_token) {
                              authResponseIsValid = true;
                              this.successful_validation();
                            } else {
                              this.oidcSecurityCommon.logWarning('authorizedCallback incorrect at_hash');

                            }
                          } else {
                            authResponseIsValid = true;
                            this.successful_validation();

                          }
                        } else {
                          this.oidcSecurityCommon.logWarning('authorizedCallback token expired');

                        }
                      } else {
                        this.oidcSecurityCommon.logWarning('authorizedCallback incorrect aud');

                      }
                    } else {
                      this.oidcSecurityCommon.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');

                    }
                  } else {
                    this.oidcSecurityCommon.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');

                  }
                } else {
                  this.oidcSecurityCommon.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');

                }
              } else {
                this.oidcSecurityCommon.logWarning('authorizedCallback incorrect nonce');

              }
            } else {
              this.oidcSecurityCommon.logDebug('authorizedCallback Signature validation failed id_token');

            }
          } else {
            this.oidcSecurityCommon.logWarning('authorizedCallback incorrect state');

          }
        }

        this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_silent_renew_running, '');

        if (authResponseIsValid) {
          this.setAuthorizationData(access_token, id_token);
          if (this.authConfiguration.auto_userinfo) {
            this.getUserinfo(isRenewProcess, result, id_token, decoded_id_token).subscribe((response) => {
              if (response) {
                resolve();
              } else {
                reject();
              }
            });
          } else {
            reject();
          }
        } else { // some went wrong
          this.oidcSecurityCommon.logDebug('authorizedCallback, token(s) validation failed, resetting');
          this.resetAuthorizationData(false);
          reject();
        }
      });
    });
  }

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
  getUserinfo(isRenewProcess = false, result?: any, id_token?: any, decoded_id_token?: any): Observable<boolean> {
    result = result ? result : this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_result);
    id_token = id_token ? id_token : this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_id_token);
    decoded_id_token = decoded_id_token ? decoded_id_token : this.oidcSecurityValidation.getPayloadFromToken(id_token, false);

    return new Observable<boolean>(observer => {
      // flow id_token token
      if (this.authConfiguration.response_type === 'id_token token') {
        if (isRenewProcess) {
          this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_session_state, result.session_state);
          observer.next(true);
          observer.complete();
        } else {
          this.oidcSecurityUserService.initUserData()
            .subscribe(() => {
              this.oidcSecurityCommon.logDebug('authorizedCallback id_token token flow');
              if (this.oidcSecurityValidation.validate_userdata_sub_id_token(decoded_id_token.sub, this.oidcSecurityUserService.userData.sub)) {
                this.setUserData(this.oidcSecurityUserService.userData);
                this.oidcSecurityCommon.logDebug(this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_access_token));
                this.oidcSecurityCommon.logDebug(this.oidcSecurityUserService.userData);
                this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_session_state, result.session_state);
                observer.next(true);
              } else { // some went wrong, userdata sub does not match that from id_token
                this.oidcSecurityCommon.logWarning('authorizedCallback, User data sub does not match sub in id_token');
                this.oidcSecurityCommon.logDebug('authorizedCallback, token(s) validation failed, resetting');
                this.resetAuthorizationData(false);
                observer.next(false);
              }
              observer.complete();
            });
        }
      } else { // flow id_token
        this.oidcSecurityCommon.logDebug('authorizedCallback id_token flow');
        this.oidcSecurityCommon.logDebug(this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_access_token));

        // userData is set to the id_token decoded. No access_token.
        this.oidcSecurityUserService.userData = decoded_id_token;
        this.setUserData(this.oidcSecurityUserService.userData);

        this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_session_state, result.session_state);

        if (!isRenewProcess) {
          // this.runTokenValidation();
        }

        observer.next(true);
        observer.complete();
      }
    });
  }

  /**
   * Used to logoff
   * 
   * @method logoff
   * @returns 
   * @memberof OidcSecurityService
   */
  logoff() {
    return new Promise(
      (resolve, reject) => {
        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
        this.oidcSecurityCommon.logDebug('BEGIN Authorize, no auth data');
    
        if (this.authWellKnownEndpoints.end_session_endpoint) {
          const authorizationEndsessionUrl = this.authWellKnownEndpoints.end_session_endpoint;
    
          const id_token_hint = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_id_token);
          const post_logout_redirect_uri = this.authConfiguration.post_logout_redirect_uri;
    
          const url =
            authorizationEndsessionUrl + '?' +
            'id_token_hint=' + encodeURI(id_token_hint) + '&' +
            'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);
    
          this.resetAuthorizationData(false);
    
          if (this.authConfiguration.start_checksession && this.checkSessionChanged) {
            this.oidcSecurityCommon.logDebug('only local login cleaned up, server session has changed');
            resolve();
          } else {
            this.oidcSecuritySilentRenew.silentLogout(url).then(
              res => {
                resolve();
              }
            )
          }
        } else {
          this.resetAuthorizationData(false);
          this.oidcSecurityCommon.logDebug('only local login cleaned up, no end_session_endpoint');
          resolve();
        }
      }
    )
  }

  /**
   * Used to when validation was succesful
   * 
   * @method successful_validation
   * @memberof OidcSecurityService
   */
  public successful_validation() {
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, '');
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, '');
    this.oidcSecurityCommon.logDebug('AuthorizedCallback token(s) validated, continue');
  }

  /**
   * Used to refresh session
   * 
   * @method refreshSession
   * @returns 
   * @memberof OidcSecurityService
   */
  public refreshSession() {
    return new Promise(
      (resolve, reject) => {
        this.oidcSecurityCommon.logDebug('BEGIN refresh session Authorize');
          const nonce = 'N' + Math.random() + '' + Date.now();
          const state = Date.now() + '' + Math.random();
      
          this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, state);
          this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, nonce);
          this.oidcSecurityCommon.logDebug('RefreshSession created. adding myautostate: ' + this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control));
      
          const url = this.createAuthorizeUrl(nonce, state, this.authWellKnownEndpoints.authorization_endpoint);
      
          this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_silent_renew_running, 'running');
          this.oidcSecuritySilentRenew.startRenew(url).then(
            res => {
              resolve();
            },
            err => {
              reject();
            }
          );
      }
    )
  }

  /**
   * Used to refresh session with webview
   * 
   * @method refreshSessionWithWebview
   * @memberof OidcSecurityService
   */
  public refreshSessionWithWebview() {
    this.oidcSecurityCommon.logDebug('BEGIN refresh session Authorize');

    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_state_control, state);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_auth_nonce, nonce);
    this.oidcSecurityCommon.logDebug('RefreshSession created. adding myautostate: ' + this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_auth_state_control));

    const url = this.createAuthorizeUrl(nonce, state, this.authWellKnownEndpoints.authorization_endpoint);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_silent_renew_running, 'running');
    this.silentRenewForWebview(url);
  }

  /**
   * Used to set authorization data
   * 
   * @method setAuthorizationData
   * @param {any} access_token 
   * @param {any} id_token 
   * @memberof OidcSecurityService
   */
  public setAuthorizationData(access_token: any, id_token: any) {
    if (this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_access_token) !== '') {
      this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_access_token, '');
    }

    this.oidcSecurityCommon.logDebug(access_token);
    this.oidcSecurityCommon.logDebug(id_token);
    this.oidcSecurityCommon.logDebug('storing to storage, getting the roles');
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_access_token, access_token);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_id_token, id_token);
    this.setIsAuthorized(true);
    this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_is_authorized, true);
  }

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
  private createAuthorizeUrl(nonce: string, state: string, authorization_endpoint: string): string {

    const urlParts = authorization_endpoint.split('?');
    const authorizationUrl = urlParts[0];
    const params = new URLSearchParams(urlParts[1]);
    params.set('client_id', this.authConfiguration.client_id);
    params.set('redirect_uri', this.authConfiguration.redirect_url);
    params.set('response_type', this.authConfiguration.response_type);
    params.set('scope', this.authConfiguration.scope);
    params.set('nonce', nonce);
    params.set('state', state);

    const customParams = Object.assign({}, this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_custom_request_params));

    Object.keys(customParams).forEach(key => {
      params.set(key, customParams[key]);
    });

    return `${authorizationUrl}?${params}`;
  }

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
  private getAuthorizeData(nonce: string, state: string, authorization_endpoint: string): {} {
    return {
    'client_id': this.authConfiguration.client_id,
    'redirect_uri': this.authConfiguration.redirect_url,
    'response_type': this.authConfiguration.response_type,
    'scope': this.authConfiguration.scope,
    'nonce': nonce,
    'state': state
    };
  }

  /**
   * Used to reset authorization data
   * 
   * @method resetAuthorizationData
   * @param {boolean} isRenewProcess 
   * @memberof OidcSecurityService
   */
  public resetAuthorizationData(isRenewProcess: boolean) {
    if (!isRenewProcess) {
      this.setIsAuthorized(false);
      this.oidcSecurityCommon.resetStorageData(isRenewProcess);
      this.checkSessionChanged = false;
    }
  }

  /**
   * Used to handle errors
   * 
   * @method handleError
   * @param {any} error 
   * @memberof OidcSecurityService
   */
  handleError(error: any) {
    this.oidcSecurityCommon.logError(error);
    if (error.status === 403) {
      this.router.navigate([this.authConfiguration.forbidden_route]);
    } else if (error.status === 401) {
      const silentRenew = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_silent_renew_running);
      this.resetAuthorizationData(silentRenew);
      this.router.navigate([this.authConfiguration.unauthorized_route]);
    }
  }

  /**
   * Used to check on check session
   * 
   * @method onCheckSessionChanged
   * @private
   * @memberof OidcSecurityService
   */
  private onCheckSessionChanged() {
    this.oidcSecurityCommon.logDebug('onCheckSessionChanged');
    this.checkSessionChanged = true;
  }

  /**
   * Used to check on well known endpoints load
   * 
   * @method onWellKnownEndpointsLoaded
   * @private
   * @memberof OidcSecurityService
   */
  private onWellKnownEndpointsLoaded() {
    this.oidcSecurityCommon.logDebug('onWellKnownEndpointsLoaded');
    this.authWellKnownEndpointsLoaded = true;
  }

  /**
   * Used to run ge signing keys
   * 
   * @method runGetSigningKeys
   * @private
   * @memberof OidcSecurityService
   */
  private runGetSigningKeys() {
    this.getSigningKeys()
      .subscribe(
      jwtKeys => this.jwtKeys = jwtKeys,
      error => this.errorMessage = <any>error);
  }

  /**
   * Used to get signing keys
   * 
   * @method getSigningKeys
   * @returns {Observable<JwtKeys>} 
   * @memberof OidcSecurityService
   */
  public getSigningKeys(): Observable<JwtKeys> {
    this.oidcSecurityCommon.logDebug('jwks_uri: ' + this.authWellKnownEndpoints.jwks_uri);
    return this.http.get(this.authWellKnownEndpoints.jwks_uri)
      .map(this.extractData)
      .catch(this.handleErrorGetSigningKeys);
  }

  /**
   * Used to extract data
   * 
   * @method extractData
   * @private
   * @param {Response} res 
   * @returns 
   * @memberof OidcSecurityService
   */
  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

  /**
   * Used to handle error get signing keys
   * 
   * @method handleErrorGetSigningKeys
   * @private
   * @param {(Response | any)} error 
   * @returns 
   * @memberof OidcSecurityService
   */
  private handleErrorGetSigningKeys(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || {};
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  
  /**
   * Used to run token validation fro browser
   * 
   * @method runTokenValidationForBrowser
   * @returns 
   * @memberof OidcSecurityService
   */
  public runTokenValidationForBrowser() {
    return new Promise(
       (resolve, reject) => {
        this.subscription  = this.source_browser.subscribe(() => {
          if (!this._isAuthorizedValue) {
            this.resetAuthorizationData(false);
          }
        },
        (err: any) => {
          this.oidcSecurityCommon.logError('Error: ' + err);
        },
        () => {
          this.oidcSecurityCommon.logDebug('Completed');
        });

        resolve();

       }
    )
  }

  /**
   * Used to run token validation for mobile
   * 
   * @method runTokenValidationForMobile
   * @returns 
   * @memberof OidcSecurityService
   */
  public runTokenValidationForMobile() {
    return new Promise(
       (resolve, reject) => {
        this.subscription.unsubscribe();
        this.subscription  = this.source_mobile.subscribe(() => {
          if (this._isAuthorizedValue) {
            const token = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_id_token);
            if (token !== '' && token !== undefined && token !== null) {
              if (this.oidcSecurityValidation.isTokenExpired(this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_id_token))) {
                this.oidcSecurityCommon.logDebug('IsAuthorized: id_token isTokenExpired, start silent renew if active');
                if (this.authConfiguration.silent_renew) {
                  this.refreshSession().then(
                    res => {
                    }
                  );
                } else {
                }
              } else {
                this.refreshSession().then(
                  res => {
                  }
                );
              }
            } else {
            }
          } else {
            this.resetAuthorizationData(false);
          }
        },
        (err: any) => {
          this.oidcSecurityCommon.logError('Error: ' + err);
        },
        () => {
          this.oidcSecurityCommon.logDebug('Completed');
        });

        if (this._isAuthorizedValue) {
          const token = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_id_token);
          if (token !== '' && token !== undefined && token !== null) {
            if (this.oidcSecurityValidation.isTokenExpired(this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_id_token))) {
              this.oidcSecurityCommon.logDebug('IsAuthorized: id_token isTokenExpired, start silent renew if active');
              if (this.authConfiguration.silent_renew) {
                this.refreshSession().then(
                  res => {
                    resolve();
                  }
                );
              } else {
                this.resetAuthorizationData(false);
                resolve();
              }
            } else {
              this.refreshSession().then(
                res => {
                  resolve();
                }
              );
            }
          } else {
            this.refreshSession().then(
              res => {
                resolve();
              }
            );
          }
        } else {
          this.resetAuthorizationData(false);
          resolve();
        }
       }
    )
  }

}
