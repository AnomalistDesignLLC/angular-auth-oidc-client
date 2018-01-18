/**
 * Provides a single interface for the AuthWellKnownEndpoints to be used in other modules
 * 
 * @file auth.well-known-endpoints
 * @author Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 * @license MIT
 * @copyright 2017 Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 */

/**
 * Dependencies
 * 
 * @import
 */
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';

/**
 * Endpoints of AuthWellKnown
 * 
 * @export
 * @class AuthWellKnownEndpoints
 * @property {EventEmitter<any>} onWellKnownEndpointsLoaded
 * @property {string} issuer
 * @property {string} jwks_uri
 * @property {string} authorization_endpoint
 * @property {string} token_endpoint
 * @property {string} userinfo_endpoint
 * @property {string} end_session_endpoint
 * @property {string} check_session_iframe
 * @property {string} revocation_endpoint
 * @property {string} introspection_endpoint
 * @method setupModule
 * @method getWellKnownEndpoints
 */
@Injectable()
export class AuthWellKnownEndpoints {

  /**
   * Used to store onWellKnownEndpointsLoaded
   * 
   * @name onWellKnownEndpointsLoaded
   * @type {EventEmitter<any>}
   * @memberof AuthWellKnownEndpoints
   */
  @Output() onWellKnownEndpointsLoaded: EventEmitter<any> = new EventEmitter<any>(true);

  /**
   * Used to store issuer
   * 
   * @name issuer
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  issuer: string;

  /**
   * Used to store jwks_uri
   * 
   * @name jwks_uri
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  jwks_uri: string;

  /**
   * USed to store authorization_endpoint
   * 
   * @name authorization_endpoint
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  authorization_endpoint: string;

  /**
   * Used to store token_endpoint
   * 
   * @name token_endpoint
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  token_endpoint: string;

  /**
   * Used to store userinfo_endpoint
   * 
   * @name userinfo_endpoint
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  userinfo_endpoint: string;

  /**
   * Used to store end_session_endpoint
   * 
   * @name end_session_endpoint
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  end_session_endpoint: string;

  /**
   * Used to store check_session_iframe
   * 
   * @name check_session_iframe
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  check_session_iframe: string;

  /**
   * Used to store revocation_endpoint
   * 
   * @name revocation_endpoint
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  revocation_endpoint: string;

  /**
   * Used to store introspection_endpoint
   * 
   * @name introspection_endpoint
   * @type {string}
   * @memberof AuthWellKnownEndpoints
   */
  introspection_endpoint: string;

  /**
   * Creates an instance of AuthWellKnownEndpoints.
   * 
   * @constructor
   * @param {Http} http 
   * @param {AuthConfiguration} authConfiguration 
   * @param {OidcSecurityCommon} oidcSecurityCommon 
   * @memberof AuthWellKnownEndpoints
   */
  constructor(
    private http: Http,
    private authConfiguration: AuthConfiguration,
    private oidcSecurityCommon: OidcSecurityCommon
  ) {}

  /**
   * Used to setup module
   * 
   * @method setupModule
   * @returns {void}
   * @memberof AuthWellKnownEndpoints
   */
  setupModule(): void {
    const data = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_well_known_endpoints);
    this.oidcSecurityCommon.logDebug(data);
    if (data && data !== '') {
      this.oidcSecurityCommon.logDebug('AuthWellKnownEndpoints already defined');
      this.issuer = data.issuer;
      this.jwks_uri = data.jwks_uri;
      this.authorization_endpoint = data.authorization_endpoint;
      this.token_endpoint = data.token_endpoint;
      this.userinfo_endpoint = data.userinfo_endpoint;

      if (data.end_session_endpoint) {
        this.end_session_endpoint = data.end_session_endpoint;

      };

      if (data.check_session_iframe) {
        this.check_session_iframe = data.check_session_iframe;
      };

      if (data.revocation_endpoint) {
        this.revocation_endpoint = data.revocation_endpoint;
      };

      if (data.introspection_endpoint) {
        this.introspection_endpoint = data.introspection_endpoint;
      }

      this.onWellKnownEndpointsLoaded.emit();
    } else {
      this.oidcSecurityCommon.logDebug('AuthWellKnownEndpoints first time, get from the server');
      this.getWellKnownEndpoints()
        .subscribe((_data: any) => {
          this.issuer = _data.issuer;
          this.jwks_uri = _data.jwks_uri;
          this.authorization_endpoint = _data.authorization_endpoint;
          this.token_endpoint = _data.token_endpoint;
          this.userinfo_endpoint = _data.userinfo_endpoint;

          if (_data.end_session_endpoint) {
            this.end_session_endpoint = _data.end_session_endpoint;
          };

          if (_data.check_session_iframe) {
            this.check_session_iframe = _data.check_session_iframe;
          };

          if (_data.revocation_endpoint) {
            this.revocation_endpoint = _data.revocation_endpoint;
          };

          if (_data.introspection_endpoint) {
            this.introspection_endpoint = _data.introspection_endpoint;
          }

          this.oidcSecurityCommon.store(this.oidcSecurityCommon.storage_well_known_endpoints, _data);
          this.oidcSecurityCommon.logDebug(_data);

          this.onWellKnownEndpointsLoaded.emit();
        });
    }
  }

  /**
   * Used to get wellknown endpoints
   * 
   * @method getWellKnownEndpoints
   * @private
   * @returns {Observable<any>}
   * @memberof AuthWellKnownEndpoints
   */
  private getWellKnownEndpoints = (): Observable<any> => {

    const headers = new Headers();
    headers.append('Accept', 'application/json');

    let url = this.authConfiguration.stsServer + '/.well-known/openid-configuration';
    if (this.authConfiguration.override_well_known_configuration) {
      url = this.authConfiguration.override_well_known_configuration_url;
    }

    return this.http.get(url, {
      headers: headers,
    }).map((res: any) => res.json());
  }

}
