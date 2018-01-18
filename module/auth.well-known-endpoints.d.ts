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
import { EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
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
export declare class AuthWellKnownEndpoints {
    private http;
    private authConfiguration;
    private oidcSecurityCommon;
    /**
     * Used to store onWellKnownEndpointsLoaded
     *
     * @name onWellKnownEndpointsLoaded
     * @type {EventEmitter<any>}
     * @memberof AuthWellKnownEndpoints
     */
    onWellKnownEndpointsLoaded: EventEmitter<any>;
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
    constructor(http: Http, authConfiguration: AuthConfiguration, oidcSecurityCommon: OidcSecurityCommon);
    /**
     * Used to setup module
     *
     * @method setupModule
     * @returns {void}
     * @memberof AuthWellKnownEndpoints
     */
    setupModule(): void;
    /**
     * Used to get wellknown endpoints
     *
     * @method getWellKnownEndpoints
     * @private
     * @returns {Observable<any>}
     * @memberof AuthWellKnownEndpoints
     */
    private getWellKnownEndpoints;
}
