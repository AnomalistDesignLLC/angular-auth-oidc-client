import { isPlatformBrowser } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Inject, PLATFORM_ID } from '@angular/core';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { catchError, pluck, take, timeInterval } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthorizationResult } from '../models/authorization-result.enum';
import { JwtKeys } from '../models/jwtkeys';
import { ValidateStateResult } from '../models/validate-state-result.model';
import {
  AuthConfiguration,
  OpenIDImplicitFlowConfiguration
} from '../modules/auth.configuration';
import { StateValidationService } from './oidc-security-state-validation.service';
import { OidcSecurityCheckSession } from './oidc.security.check-session';
import { OidcSecurityCommon } from './oidc.security.common';
import { OidcSecuritySilentRenew } from './oidc.security.silent-renew';
import { OidcSecurityUserService } from './oidc.security.user-service';
import { OidcSecurityValidation } from './oidc.security.validation';
import { UriEncoder } from './uri-encoder';
import { OidcDataService } from './oidc-data.service';
import { TokenHelperService } from './oidc-token-helper.service';
import { LoggerService } from './oidc.logger.service';
import { AuthWellKnownEndpoints } from '../models/auth.well-known-endpoints';

@Injectable()
export class OidcSecurityService {
  @Output() onModuleSetup = new EventEmitter<boolean>();
  @Output() onAuthorizationResult = new EventEmitter<AuthorizationResult>();
  @Output() onCheckSessionChanged = new EventEmitter<boolean>();

  checkSessionChanged: boolean;
  moduleSetup = false;
  private authWellKnownEndpoints: AuthWellKnownEndpoints;
  private _isAuthorized = new BehaviorSubject<boolean>(false);
  private _isAuthorizedValue: boolean;

  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isLoadingValue: boolean;

  private lastUserData: any;
  private _userData = new BehaviorSubject<any>('');

  private authWellKnownEndpointsLoaded = false;
  private runTokenValidationRunning: boolean;

  private CheckForPopupClosedInterval: number;
  private _checkForPopupClosedTimer: any;
  private _popup: any;
  private _popupFor: string;
  private authenticationScheme: string;
  private loginMethod: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private oidcDataService: OidcDataService,
    private stateValidationService: StateValidationService,
    private authConfiguration: AuthConfiguration,
    private router: Router,
    private oidcSecurityCheckSession: OidcSecurityCheckSession,
    private oidcSecuritySilentRenew: OidcSecuritySilentRenew,
    private oidcSecurityUserService: OidcSecurityUserService,
    private oidcSecurityCommon: OidcSecurityCommon,
    private oidcSecurityValidation: OidcSecurityValidation,
    private tokenHelperService: TokenHelperService,
    private loggerService: LoggerService,
    private httpClient: HttpClient
  ) {}

  setupModule(
    openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration,
    authWellKnownEndpoints: AuthWellKnownEndpoints
  ): void {
    this.authWellKnownEndpoints = Object.assign({}, authWellKnownEndpoints);
    this.authConfiguration.init(openIDImplicitFlowConfiguration);
    this.stateValidationService.setupModule(authWellKnownEndpoints);
    this.oidcSecurityCheckSession.setupModule(authWellKnownEndpoints);
    this.oidcSecurityUserService.setupModule(authWellKnownEndpoints);

    this.oidcSecurityCheckSession.onCheckSessionChanged.subscribe(() => {
      this.loggerService.logDebug('onCheckSessionChanged');
      this.checkSessionChanged = true;
      this.onCheckSessionChanged.emit(
        this.checkSessionChanged
      );
    });

    this._userData.subscribe(() => {
      this.onUserDataChanged();
    });

    const userData = this.oidcSecurityCommon.userData;
    if (userData) {
      this.setUserData(userData);
    }

    const isAuthorized = this.oidcSecurityCommon.isAuthorized;
    if (isAuthorized) {
      this.loggerService.logDebug('IsAuthorized setup module');
      this.loggerService.logDebug(this.oidcSecurityCommon.idToken);
      if (this.oidcSecurityValidation.isTokenExpired(
          this.oidcSecurityCommon.idToken,
          this.authConfiguration.silent_renew_offset_in_seconds)
      ) {
        this.loggerService.logDebug('IsAuthorized setup module; id_token isTokenExpired');
      } else {
        this.loggerService.logDebug('IsAuthorized setup module; id_token is valid');
        this.setIsAuthorized(isAuthorized);
        this.runTokenValidation();
      }
    }

    this.loggerService.logDebug(
      'STS server: ' + this.authConfiguration.stsServer
    );

    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      this.moduleSetup = true;
      this.onModuleSetup.emit();

      if (this.authConfiguration.silent_renew) {
        this.oidcSecuritySilentRenew.initRenew();
      }

      if (
        this.authConfiguration.start_checksession &&
        !this.oidcSecurityCheckSession.doesSessionExist()
      ) {
        this.oidcSecurityCheckSession.init().subscribe(() => {
          this.oidcSecurityCheckSession.pollServerSession(
            this.authConfiguration.client_id
          );
        });
      }
    } else {
      this.moduleSetup = true;
      this.onModuleSetup.emit();
    }
  }

  getUserData(): Observable<any> {
    return this._userData.asObservable();
  }

  getIsAuthorized(): Observable<boolean> {
    return this._isAuthorized.asObservable();
  }

  getToken(): string {
    if (!this._isAuthorizedValue) {
      return '';
    }

    const token = this.oidcSecurityCommon.getAccessToken();
    return decodeURIComponent(token);
  }

  getIdToken(): string {
    if (!this._isAuthorizedValue) {
      return '';
    }

    const token = this.oidcSecurityCommon.getIdToken();
    return decodeURIComponent(token);
  }

  getPayloadFromIdToken(encode = false): any {
    const token = this.getIdToken();
    return this.tokenHelperService.getPayloadFromToken(token, encode);
  }

  setState(state: string): void {
    this.oidcSecurityCommon.authStateControl = state;
  }

  getState(): string {
    return this.oidcSecurityCommon.authStateControl;
  }

  setCustomRequestParameters(params: {
    [key: string]: string | number | boolean;
  }) {
    this.oidcSecurityCommon.customRequestParams = params;
  }

  popup_cleanup() {
    window.clearInterval(this._checkForPopupClosedTimer);
    this._checkForPopupClosedTimer = null;
    this._popup = null;
  }

  _checkForPopupClosed() {
    try {
      if (this._popup.location.href !== 'about:blank' && this._popup.location.href !== undefined) {
        let a = this._popup.location.href.split('/');
        a = a[(a.length - 1)];
        if (a !== 'login') {
          this._popup.close();
          if (!this._popup || this._popup.closed) {
            const hash = this._popup.location.hash.substr(1);
            this.authorizedCallback(hash);
            this.popup_cleanup();
          }
        } else {
          if (!this._popup || this._popup.closed) {
            this.popup_cleanup();
          } else {
            this._popupFor = 'afterRegistration';
            this.authorize(this.authenticationScheme, this.loginMethod);
          }
        }
      }
    } catch (err) {
      // do nothing
    }
  }

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

  popup_login(url: string, title: string, w: number, h: number) {
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
    this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), this.CheckForPopupClosedInterval);
  }

  authorize(authenticationScheme: string = 'local', loginMethod: string = 'redirect') {
    this.authenticationScheme = authenticationScheme;
    this.loginMethod = loginMethod;
    if (this.authWellKnownEndpoints) {
      this.authWellKnownEndpointsLoaded = true;
    }

    if (!this.authWellKnownEndpointsLoaded) {
      this.loggerService.logError(
        'Well known endpoints must be loaded before user can login!'
      );
      return;
    }

    if (
      !this.oidcSecurityValidation.config_validate_response_type(
        this.authConfiguration.response_type
      )
    ) {
      // invalid response_type
      return;
    }

    this.resetAuthorizationData(false);

    this.loggerService.logDebug('BEGIN Authorize, no auth data');

    let state = this.oidcSecurityCommon.authStateControl;
    if (!state) {
      state = Date.now() + '' + Math.random();
      this.oidcSecurityCommon.authStateControl = state;
    }

    const nonce = 'N' + Math.random() + '' + Date.now();
    this.oidcSecurityCommon.authNonce = nonce;
    this.loggerService.logDebug(
      'AuthorizedController created. local state: ' +
        this.oidcSecurityCommon.authStateControl
    );

    let url = this.createAuthorizeUrl(
      nonce,
      state,
      this.authWellKnownEndpoints.authorization_endpoint
    );
    url = url + '&authenticationScheme=' + authenticationScheme;

    if (loginMethod === 'popup') {
      if (this._popupFor === 'afterRegistration') {
        this._popup.location.href = url;
      } else {
        this.popup_login(url, 'QPONS\' AUTHORIZATION PAGE', 800, 800);
      }
    } else {
      window.location.href = url;
    }
  }

  authorizedCallback(hash?: string) {
    this.setIsLoading(true);
    const silentRenew = this.oidcSecurityCommon.silentRenewRunning;
    const isRenewProcess = silentRenew === 'running';

    this.loggerService.logDebug('BEGIN authorizedCallback, no auth data');
    this.resetAuthorizationData(isRenewProcess);

    hash = hash || window.location.hash.substr(1);

    const result: any = hash
      .split('&')
      .reduce(function(resultData: any, item: string) {
        const parts = item.split('=');
        resultData[parts[0]] = parts[1];
        return resultData;
      }, {});

    this.oidcSecurityCommon.authResult = result;
    this.loggerService.logDebug(result);
    this.loggerService.logDebug(
      'authorizedCallback created, begin token validation'
    );

    this.getSigningKeys().subscribe((jwtKeys: any) => {
      const validationResult = this.getValidatedStateResult(
        result,
        jwtKeys
      );

      if (validationResult.authResponseIsValid) {
        this.setAuthorizationData(
          validationResult.access_token,
          validationResult.id_token
        );
        this.oidcSecurityCommon.silentRenewRunning = '';

        if (this.authConfiguration.auto_userinfo) {
          this.getUserinfo(
            isRenewProcess,
            result,
            validationResult.id_token,
            validationResult.decoded_id_token
          ).subscribe((response: any) => {
            this.setIsLoading(false);
            if (response) {
              this.onAuthorizationResult.emit(AuthorizationResult.authorized);
              if (!this.authConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                this.router.navigate([
                  this.authConfiguration.post_login_route
                ]);
              }
            } else {
              this.onAuthorizationResult.emit(AuthorizationResult.unauthorized);
              if (!this.authConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                this.router.navigate([
                  this.authConfiguration.unauthorized_route
                ]);
              }
            }
          });
        } else {
          this.setIsLoading(false);
          if (!isRenewProcess) {
            // userData is set to the id_token decoded, auto get user data set to false
            this.oidcSecurityUserService.setUserData(
              validationResult.decoded_id_token
            );
            this.setUserData(
              this.oidcSecurityUserService.getUserData()
            );
            this.runTokenValidation();
          }

          this.onAuthorizationResult.emit(AuthorizationResult.authorized);
          if (!this.authConfiguration.trigger_authorization_result_event && !isRenewProcess) {
            this.router.navigate([
              this.authConfiguration.post_login_route
            ]);
          }
        }
      } else {
        this.setIsLoading(false);
        // something went wrong
        this.loggerService.logWarning(
          'authorizedCallback, token(s) validation failed, resetting'
        );
        this.loggerService.logWarning(window.location.hash);
        this.resetAuthorizationData(false);
        this.oidcSecurityCommon.silentRenewRunning = '';

        this.onAuthorizationResult.emit(AuthorizationResult.unauthorized);
        if (!this.authConfiguration.trigger_authorization_result_event && !isRenewProcess) {
          this.router.navigate([
            this.authConfiguration.unauthorized_route
          ]);
        }
      }
    });
  }

  getUserinfo(
    isRenewProcess = false,
    result?: any,
    id_token?: any,
    decoded_id_token?: any
  ): Observable<boolean> {
    result = result ? result : this.oidcSecurityCommon.authResult;
    id_token = id_token ? id_token : this.oidcSecurityCommon.idToken;
    decoded_id_token = decoded_id_token
      ? decoded_id_token
      : this.tokenHelperService.getPayloadFromToken(id_token, false);

    return new Observable<boolean>((observer: any) => {
      // flow id_token token
      if (this.authConfiguration.response_type === 'id_token token') {
        if (isRenewProcess) {
          this.oidcSecurityCommon.sessionState = result.session_state;
          observer.next(true);
          observer.complete();
        } else {
          this.oidcSecurityUserService
            .initUserData()
            .subscribe(() => {
              this.loggerService.logDebug(
                'authorizedCallback id_token token flow'
              );

              const userData = this.oidcSecurityUserService.getUserData();

              if (
                this.oidcSecurityValidation.validate_userdata_sub_id_token(
                  decoded_id_token.sub,
                  userData.sub
                )
              ) {
                this.setUserData(userData);
                this.loggerService.logDebug(
                  this.oidcSecurityCommon.accessToken
                );
                this.loggerService.logDebug(
                  this.oidcSecurityUserService.getUserData()
                );

                this.oidcSecurityCommon.sessionState =
                  result.session_state;

                this.runTokenValidation();
                observer.next(true);
              } else {
                // something went wrong, userdata sub does not match that from id_token
                this.loggerService.logWarning(
                  'authorizedCallback, User data sub does not match sub in id_token'
                );
                this.loggerService.logDebug(
                  'authorizedCallback, token(s) validation failed, resetting'
                );
                this.resetAuthorizationData(false);
                observer.next(false);
              }
              observer.complete();
            });
        }
      } else {
        // flow id_token
        this.loggerService.logDebug('authorizedCallback id_token flow');
        this.loggerService.logDebug(
          this.oidcSecurityCommon.accessToken
        );

        // userData is set to the id_token decoded. No access_token.
        this.oidcSecurityUserService.setUserData(decoded_id_token);
        this.setUserData(this.oidcSecurityUserService.getUserData());

        this.oidcSecurityCommon.sessionState = result.session_state;

        if (!isRenewProcess) {
          this.runTokenValidation();
        }

        observer.next(true);
        observer.complete();
      }
    });
  }

  async logoff() {
    // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
    this.loggerService.logDebug('BEGIN Authorize, no auth data');

    if (this.authWellKnownEndpoints.end_session_endpoint) {
      const end_session_endpoint = this.authWellKnownEndpoints
        .end_session_endpoint;
      const id_token_hint = this.oidcSecurityCommon.idToken;
      const url = this.createEndSessionUrl(
        end_session_endpoint,
        id_token_hint
      );

      this.resetAuthorizationData(false);

      if (
        this.authConfiguration.start_checksession &&
        this.checkSessionChanged
      ) {
        this.loggerService.logDebug(
          'only local login cleaned up, server session has changed'
        );
      } else {
        // window.location.href = url;
        await this.oidcSecuritySilentRenew.logout(url);
        this.oidcSecuritySilentRenew.removeiFrameForSilentLogout();
      }
    } else {
      this.resetAuthorizationData(false);
      this.loggerService.logDebug(
        'only local login cleaned up, no end_session_endpoint'
      );
    }
  }

  refreshSession() {
    this.loggerService.logDebug('BEGIN refresh session Authorize');

    let state = this.oidcSecurityCommon.authStateControl;
    if (state === '' || state === null) {
      state = Date.now() + '' + Math.random();
      this.oidcSecurityCommon.authStateControl = state;
    }

    const nonce = 'N' + Math.random() + '' + Date.now();
    this.oidcSecurityCommon.authNonce = nonce;
    this.loggerService.logDebug(
      'RefreshSession created. adding myautostate: ' +
        this.oidcSecurityCommon.authStateControl
    );

    const url = this.createAuthorizeUrl(
      nonce,
      state,
      this.authWellKnownEndpoints.authorization_endpoint,
      'none'
    );

    this.oidcSecurityCommon.silentRenewRunning = 'running';
    this.oidcSecuritySilentRenew.startRenew(url);
  }

  handleError(error: any) {
    this.loggerService.logError(error);
    if (error.status === 403 || error.status === '403') {
      if (this.authConfiguration.trigger_authorization_result_event) {
        this.onAuthorizationResult.emit(
          AuthorizationResult.unauthorized
        );
      } else {
        this.router.navigate([this.authConfiguration.forbidden_route]);
      }
    } else if (error.status === 401 || error.status === '401') {
      const silentRenew = this.oidcSecurityCommon.silentRenewRunning;

      this.resetAuthorizationData(!!silentRenew);

      if (this.authConfiguration.trigger_authorization_result_event) {
        this.onAuthorizationResult.emit(
          AuthorizationResult.unauthorized
        );
      } else {
        this.router.navigate([
          this.authConfiguration.unauthorized_route
        ]);
      }
    }
  }

  private getValidatedStateResult(
    result: any,
    jwtKeys: JwtKeys
  ): ValidateStateResult {
    if (result.error) {
      return new ValidateStateResult('', '', false, {});
    }

    return this.stateValidationService.validateState(result, jwtKeys);
  }

  private setUserData(userData: any): void {
    this.oidcSecurityCommon.userData = userData;
    this._userData.next(userData);
  }

  private setIsAuthorized(isAuthorized: boolean): void {
    this._isAuthorizedValue = isAuthorized;
    this._isAuthorized.next(isAuthorized);
  }

  private setAuthorizationData(access_token: any, id_token: any) {
    if (this.oidcSecurityCommon.accessToken !== '') {
      this.oidcSecurityCommon.accessToken = '';
    }

    this.loggerService.logDebug(access_token);
    this.loggerService.logDebug(id_token);
    this.loggerService.logDebug('storing to storage, getting the roles');
    this.oidcSecurityCommon.accessToken = access_token;
    this.oidcSecurityCommon.idToken = id_token;
    this.setIsAuthorized(true);
    this.oidcSecurityCommon.isAuthorized = true;
  }

  getIsLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  private setIsLoading(isAuthorized: boolean) {
    this._isLoadingValue = isAuthorized;
    this._isLoading.next(isAuthorized);
  }

  private createAuthorizeUrl(
    nonce: string,
    state: string,
    authorization_endpoint: string,
    prompt?: string
  ): string {
    const urlParts = authorization_endpoint.split('?');
    const authorizationUrl = urlParts[0];
    let params = new HttpParams({
      fromString: urlParts[1],
      encoder: new UriEncoder()
    });
    params = params.set('client_id', this.authConfiguration.client_id);
    params = params.append(
      'redirect_uri',
      this.authConfiguration.redirect_url
    );
    params = params.append(
      'response_type',
      this.authConfiguration.response_type
    );
    params = params.append('scope', this.authConfiguration.scope);
    params = params.append('nonce', nonce);
    params = params.append('state', state);

    if (prompt) {
      params = params.append('prompt', prompt);
    }

    if (this.authConfiguration.hd_param) {
      params = params.append('hd', this.authConfiguration.hd_param);
    }

    const customParams = Object.assign(
      {},
      this.oidcSecurityCommon.customRequestParams
    );

    Object.keys(customParams).forEach(key => {
      params = params.append(key, customParams[key].toString());
    });

    return `${authorizationUrl}?${params}`;
  }

  private createEndSessionUrl(
    end_session_endpoint: string,
    id_token_hint: string
  ) {
    const urlParts = end_session_endpoint.split('?');

    const authorizationEndsessionUrl = urlParts[0];

    let params = new HttpParams({
      fromString: urlParts[1],
      encoder: new UriEncoder()
    });
    params = params.set('id_token_hint', id_token_hint);
    params = params.append(
      'post_logout_redirect_uri',
      this.authConfiguration.post_logout_redirect_uri
    );

    return `${authorizationEndsessionUrl}?${params}`;
  }

  private resetAuthorizationData(isRenewProcess: boolean) {
    if (!isRenewProcess) {
      if (this.authConfiguration.auto_userinfo) {
        // Clear user data. Fixes #97.
        this.setUserData('');
      }
      this.setIsAuthorized(false);
      this.oidcSecurityCommon.resetStorageData(isRenewProcess);
      this.checkSessionChanged = false;
    }
  }

  private onUserDataChanged() {
    this.loggerService.logDebug(
      `onUserDataChanged: last = ${this.lastUserData}, new = ${
        this._userData.value
      }`
    );

    if (this.lastUserData && !this._userData.value) {
      this.loggerService.logDebug('onUserDataChanged: Logout detected.');
      // TODO should we have an action here
    }
    this.lastUserData = this._userData.value;
  }

  private getSigningKeys(): Observable<JwtKeys> {
    this.loggerService.logDebug(
      'jwks_uri: ' + this.authWellKnownEndpoints.jwks_uri
    );
    return this.oidcDataService
      .get<JwtKeys>(this.authWellKnownEndpoints.jwks_uri)
      .pipe(catchError(this.handleErrorGetSigningKeys));
  }

  private handleErrorGetSigningKeys(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || {};
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private runTokenValidation() {
    if (this.runTokenValidationRunning) {
      return;
    }
    this.runTokenValidationRunning = true;

    const source = timer(5000, 3000).pipe(
      timeInterval(),
      pluck('interval'),
      take(10000)
    );

    source.subscribe(
      () => {
        if (this._userData.value && (this.oidcSecurityCommon.silentRenewRunning !== 'running') && this.getIdToken()) {
          if (this.oidcSecurityValidation.isTokenExpired(
              this.oidcSecurityCommon.idToken,
              this.authConfiguration.silent_renew_offset_in_seconds
            )
          ) {
            this.loggerService.logDebug(
              'IsAuthorized: id_token isTokenExpired, start silent renew if active'
            );

            if (this.authConfiguration.silent_renew) {
              this.refreshSession();
            } else {
              this.resetAuthorizationData(false);
            }
          }
        }
      },
      (err: any) => {
        this.loggerService.logError('Error: ' + err);
      },
      () => {
        this.loggerService.logDebug('Completed');
      }
    );
  }
}
