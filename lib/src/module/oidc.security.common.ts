/**
 * Provides a single interface for the OidcSecurityCommon to be used in other modules
 * 
 * @file oidc.security.common
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
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityStorage } from './oidc.security.storage';

/**
 * THis is for oidc security common
 * 
 * @export
 * @class OidcSecurityCommon
 * @property {string} storage_auth_result
 * @property {string} storage_access_token
 * @property {string} storage_id_token
 * @property {string} storage_is_authorized
 * @property {string} storage_user_data
 * @property {string} storage_auth_nonce
 * @property {string} storage_auth_state_control
 * @property {string} storage_well_known_endpoints
 * @property {string} storage_session_state
 * @property {string} storage_silent_renew_running
 * @property {string} storage_custom_request_params
 * @method setupModule
 * @method retrieve
 * @method store
 * @method resetStorageData
 * @method getAccessToken
 * @method getAccessToken
 * @method logError
 * @method logWarning
 * @method logDebug
 */
@Injectable()
export class OidcSecurityCommon {

  /**
   * Used to store storage_auth_result
   * 
   * @name storage_auth_result
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_auth_result: string = 'authorizationResult';

  /**
   * Used to store storage_access_token
   * 
   * @name storage_access_token
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_access_token: string = 'authorizationData';

  /**
   * Used to store storage_id_token
   * 
   * @name storage_id_token
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_id_token: string = 'authorizationDataIdToken';

  /**
   * Used to store storage_is_authorized
   * 
   * @name storage_is_authorized
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_is_authorized: string = '_isAuthorized';

  /**
   * Used to store storage_user_data
   * 
   * @name storage_user_data
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_user_data: string = 'userData';

  /**
   * Used to store storage_auth_nonce
   * 
   * @name storage_auth_nonce
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_auth_nonce: string = 'authNonce';

  /**
   * Used to store storage_auth_state_control
   * 
   * @name storage_auth_state_control
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_auth_state_control: string = 'authStateControl';

  /**
   * Used to store storage_well_known_endpoints
   * 
   * @name storage_well_known_endpoints
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_well_known_endpoints: string = 'wellknownendpoints';

  /**
   * Used to store storage_session_state
   * 
   * @name storage_session_state
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_session_state: string = 'session_state';

  /**
   * Used to store storage_silent_renew_running
   * 
   * @name storage_silent_renew_running
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_silent_renew_running: string = 'storage_silent_renew_running';

  /**
   * Used to store storage_custom_request_params
   * 
   * @name storage_custom_request_params
   * @type {string}
   * @memberof OidcSecurityCommon
   */
  storage_custom_request_params: string = 'storage_custom_request_params';

  /**
   * Creates an instance of OidcSecurityCommon.
   * 
   * @constructor
   * @param {AuthConfiguration} authConfiguration 
   * @param {OidcSecurityStorage} oidcSecurityStorage 
   * @memberof OidcSecurityCommon
   */
  constructor(
    private authConfiguration: AuthConfiguration, 
    private oidcSecurityStorage: OidcSecurityStorage
  ) {}

  /**
   * Used to setupModule 
   * 
   * @method setupModule 
   * @memberof OidcSecurityCommon
   */
  setupModule() { }

  /**
   * Used for retrieviing value in storage 
   * 
   * @method retrieve
   * @param {string} key 
   * @returns {any} 
   * @memberof OidcSecurityCommon
   */
  retrieve(key: string): any {
    return this.oidcSecurityStorage.read(key);
  }

  /**
   * Used to storing valud in storage
   * 
   * @method store
   * @param {string} key 
   * @param {any} value 
   * @memberof OidcSecurityCommon
   */
  store(key: string, value: any) {
    this.oidcSecurityStorage.write(key, value);
  }

  /**
   * Used to reset storage data 
   * 
   * @method resetStorageData
   * @param {boolean} isRenewProcess 
   * @memberof OidcSecurityCommon
   */
  resetStorageData(isRenewProcess: boolean) {
    if (!isRenewProcess) {
      this.store(this.storage_auth_result, '');
      this.store(this.storage_session_state, '');
      this.store(this.storage_silent_renew_running, '');
      this.store(this.storage_is_authorized, false);
      this.store(this.storage_access_token, '');
      this.store(this.storage_id_token, '');
      this.store(this.storage_user_data, '');
    }
  }

  /**
   * Used to get Access Token 
   * 
   * @method getAccessToken
   * @returns {any} 
   * @memberof OidcSecurityCommon
   */
  getAccessToken(): any {
    return this.retrieve(this.storage_access_token);
  }

  /**
   * Used to get id token 
   * 
   * @method getAccessToken
   * @returns {any} 
   * @memberof OidcSecurityCommon
   */
  getIdToken(): any {
    return this.retrieve(this.storage_id_token);
  }

  /**
   * Used to log error 
   * 
   * @method logError 
   * @param {any} message 
   * @memberof OidcSecurityCommon
   */
  logError(message: any) {
    console.error(message);
  }

  /**
   * Used to log warning 
   * 
   * @method logWarning
   * @param {any} message 
   * @memberof OidcSecurityCommon
   */
  logWarning(message: any) {
    if (this.authConfiguration.log_console_warning_active) {
      console.warn(message);
    }
  }

  /**
   * Used to log debug 
   * 
   * @method logDebug
   * @param {any} message 
   * @memberof OidcSecurityCommon
   */
  logDebug(message: any) {
    if (this.authConfiguration.log_console_debug_active) {
      console.log(message);
    }
  }

}
