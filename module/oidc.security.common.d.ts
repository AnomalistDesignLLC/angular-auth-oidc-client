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
export declare class OidcSecurityCommon {
    private authConfiguration;
    private oidcSecurityStorage;
    /**
     * Used to store storage_auth_result
     *
     * @name storage_auth_result
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_auth_result: string;
    /**
     * Used to store storage_access_token
     *
     * @name storage_access_token
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_access_token: string;
    /**
     * Used to store storage_id_token
     *
     * @name storage_id_token
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_id_token: string;
    /**
     * Used to store storage_is_authorized
     *
     * @name storage_is_authorized
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_is_authorized: string;
    /**
     * Used to store storage_user_data
     *
     * @name storage_user_data
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_user_data: string;
    /**
     * Used to store storage_auth_nonce
     *
     * @name storage_auth_nonce
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_auth_nonce: string;
    /**
     * Used to store storage_auth_state_control
     *
     * @name storage_auth_state_control
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_auth_state_control: string;
    /**
     * Used to store storage_well_known_endpoints
     *
     * @name storage_well_known_endpoints
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_well_known_endpoints: string;
    /**
     * Used to store storage_session_state
     *
     * @name storage_session_state
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_session_state: string;
    /**
     * Used to store storage_silent_renew_running
     *
     * @name storage_silent_renew_running
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_silent_renew_running: string;
    /**
     * Used to store storage_custom_request_params
     *
     * @name storage_custom_request_params
     * @type {string}
     * @memberof OidcSecurityCommon
     */
    storage_custom_request_params: string;
    /**
     * Creates an instance of OidcSecurityCommon.
     *
     * @constructor
     * @param {AuthConfiguration} authConfiguration
     * @param {OidcSecurityStorage} oidcSecurityStorage
     * @memberof OidcSecurityCommon
     */
    constructor(authConfiguration: AuthConfiguration, oidcSecurityStorage: OidcSecurityStorage);
    /**
     * Used to setupModule
     *
     * @method setupModule
     * @memberof OidcSecurityCommon
     */
    setupModule(): void;
    /**
     * Used for retrieviing value in storage
     *
     * @method retrieve
     * @param {string} key
     * @returns {any}
     * @memberof OidcSecurityCommon
     */
    retrieve(key: string): any;
    /**
     * Used to storing valud in storage
     *
     * @method store
     * @param {string} key
     * @param {any} value
     * @memberof OidcSecurityCommon
     */
    store(key: string, value: any): void;
    /**
     * Used to reset storage data
     *
     * @method resetStorageData
     * @param {boolean} isRenewProcess
     * @memberof OidcSecurityCommon
     */
    resetStorageData(isRenewProcess: boolean): void;
    /**
     * Used to get Access Token
     *
     * @method getAccessToken
     * @returns {any}
     * @memberof OidcSecurityCommon
     */
    getAccessToken(): any;
    /**
     * Used to get id token
     *
     * @method getAccessToken
     * @returns {any}
     * @memberof OidcSecurityCommon
     */
    getIdToken(): any;
    /**
     * Used to log error
     *
     * @method logError
     * @param {any} message
     * @memberof OidcSecurityCommon
     */
    logError(message: any): void;
    /**
     * Used to log warning
     *
     * @method logWarning
     * @param {any} message
     * @memberof OidcSecurityCommon
     */
    logWarning(message: any): void;
    /**
     * Used to log debug
     *
     * @method logDebug
     * @param {any} message
     * @memberof OidcSecurityCommon
     */
    logDebug(message: any): void;
}
