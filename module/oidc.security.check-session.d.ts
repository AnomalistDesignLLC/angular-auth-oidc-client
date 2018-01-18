/**
 * Provides a single interface for the OidcSecurityCheckSession to be used in other modules
 *
 * @file oidc.security.check-session
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
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';
import { AuthWellKnownEndpoints } from './auth.well-known-endpoints';
/**
 * Used for checking session using OIDC
 * http://openid.net/specs/openid-connect-session-1_0-ID4.html
 *
 * @export
 * @class OidcSecurityCheckSession
 * @property {any} sessionIframe
 * @property {any} iframeMessageEvent
 * @property {EventEmitter<any>} onCheckSessionChanged
 * @method init
 * @method pollServerSession
 * @method messageHandler
 */
export declare class OidcSecurityCheckSession {
    private authConfiguration;
    private oidcSecurityCommon;
    private authWellKnownEndpoints;
    /**
     * Used to store sessionIframe
     *
     * @name sessionIframe
     * @private
     * @type {any}
     * @memberof OidcSecurityCheckSession
     */
    private sessionIframe;
    /**
     * Used to store iframeMessageEvent
     *
     * @name iframeMessageEvent
     * @private
     * @type {any}
     * @memberof OidcSecurityCheckSession
     */
    private iframeMessageEvent;
    /**
     * Used to store onCheckSessionChanged
     *
     * @name onCheckSessionChanged
     * @type {EventEmitter<any>}
     * @memberof OidcSecurityCheckSession
     */
    onCheckSessionChanged: EventEmitter<any>;
    /**
     * Creates an instance of OidcSecurityCheckSession.
     *
     * @constructor
     * @param {AuthConfiguration} authConfiguration
     * @param {OidcSecurityCommon} oidcSecurityCommon
     * @param {AuthWellKnownEndpoints} authWellKnownEndpoints
     * @memberof OidcSecurityCheckSession
     */
    constructor(authConfiguration: AuthConfiguration, oidcSecurityCommon: OidcSecurityCommon, authWellKnownEndpoints: AuthWellKnownEndpoints);
    /**
     * Used to initialize check session
     *
     * @method init
     * @returns {any}
     * @memberof OidcSecurityCheckSession
     */
    init(): any;
    /**
     * Used to poll server session
     *
     * @method pollServerSession
     * @param {any} clientId
     * @memberof OidcSecurityCheckSession
     */
    pollServerSession(clientId: any): void;
    /**
     * Used to message handler
     *
     * @method messageHandler
     * @private
     * @param {any} e
     * @memberof OidcSecurityCheckSession
     */
    private messageHandler(e);
}
