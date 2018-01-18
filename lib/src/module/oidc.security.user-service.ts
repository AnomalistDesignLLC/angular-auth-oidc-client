/**
 * Provides a single interface for the OidcSecurityUserService to be used in other modules
 * 
 * @file oidc.security.user-service
 * @author Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 * @license MIT
 * @copyright 2017 Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 */

/**
 * Dependencies
 * 
 * @import
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
@Injectable()
export class OidcSecurityUserService {

  /**
   * Used to store userData
   * 
   * @type {any}
   * @memberof OidcSecurityUserService
   */
  userData: any = '';

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
  constructor(
    private http: Http,
    private authConfiguration: AuthConfiguration,
    private oidcSecurityCommon: OidcSecurityCommon,
    private authWellKnownEndpoints: AuthWellKnownEndpoints
  ) {}

  /**
   * Used to initialize user data
   * 
   * @method initUserData
   * @public
   * @returns {any}
   * @memberof OidcSecurityUserService
   */
  public initUserData(): any {
    return this.getIdentityUserData()
      .map(data => {
        if (data !== undefined && data !== null) {
          this.userData = data;
        }
      });
  }

  /**
   * Used to get identity user data
   * 
   * @method getIdentityUserData
   * @private
   * @returns {Observable<any}
   * @memberof OidcSecurityUserService
   */
  private getIdentityUserData = (): Observable<any> => {

    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const token = this.oidcSecurityCommon.getAccessToken();

    if (token !== '') {
      headers.append('Authorization', 'Bearer ' + decodeURIComponent(token));
    }

    return this.http.get(this.authWellKnownEndpoints.userinfo_endpoint, {
      headers: headers,
      body: ''
    }).map((res: any) => {
      if (/^[\],:{}\s]*$/.test(res._body.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        this.userData = res.json();
      
      } else {
      
        // the json is not ok
      
      }
    });
  }

  /**
   * Used to handle errors
   * 
   * @method handleError
   * @private
   * @param {any} error 
   * @return {void}
   * @memberof OidcSecurityUserService
   */
  private handleError(error: any): void {
    this.oidcSecurityCommon.logError(error);
  }

}
