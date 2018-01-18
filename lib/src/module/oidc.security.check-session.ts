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
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';
import { AuthWellKnownEndpoints } from './auth.well-known-endpoints';
import { Observer } from 'rxjs/Observer';

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
@Injectable()
export class OidcSecurityCheckSession {

  /**
   * Used to store sessionIframe
   * 
   * @name sessionIframe
   * @private
   * @type {any}
   * @memberof OidcSecurityCheckSession
   */
  private sessionIframe: any;

  /**
   * Used to store iframeMessageEvent
   * 
   * @name iframeMessageEvent
   * @private
   * @type {any}
   * @memberof OidcSecurityCheckSession
   */
  private iframeMessageEvent: any;

  /**
   * Used to store onCheckSessionChanged
   * 
   * @name onCheckSessionChanged
   * @type {EventEmitter<any>}
   * @memberof OidcSecurityCheckSession
   */
  @Output() onCheckSessionChanged: EventEmitter<any> = new EventEmitter<any>(true);

  /**
   * Creates an instance of OidcSecurityCheckSession.
   * 
   * @constructor
   * @param {AuthConfiguration} authConfiguration 
   * @param {OidcSecurityCommon} oidcSecurityCommon 
   * @param {AuthWellKnownEndpoints} authWellKnownEndpoints 
   * @memberof OidcSecurityCheckSession
   */
  constructor(
    private authConfiguration: AuthConfiguration,
    private oidcSecurityCommon: OidcSecurityCommon,
    private authWellKnownEndpoints: AuthWellKnownEndpoints
  ) {}

  /**
   * Used to initialize check session
   * 
   * @method init
   * @returns {any}
   * @memberof OidcSecurityCheckSession
   */
  init(): any {
    
    const exists = window.parent.document.getElementById('myiFrameForCheckSession');
    if (!exists) {
      this.sessionIframe = window.document.createElement('iframe');

      this.sessionIframe.id = 'myiFrameForCheckSession';
      this.oidcSecurityCommon.logDebug(this.sessionIframe);
      this.sessionIframe.style.display = 'none';
      this.sessionIframe.src = this.authWellKnownEndpoints.check_session_iframe;

      window.document.body.appendChild(this.sessionIframe);
      this.iframeMessageEvent = this.messageHandler.bind(this);
      window.addEventListener('message', this.iframeMessageEvent, false);

      return Observable.create((observer: Observer<any>) => {
        this.sessionIframe.onload = () => {
          observer.next(this);
          observer.complete();
        }
      });
    }

    return Observable.empty<Response>();
  }

  /**
   * Used to poll server session
   * 
   * @method pollServerSession
   * @param {any} clientId 
   * @memberof OidcSecurityCheckSession
   */
  pollServerSession(clientId: any) {
    let source: any;
    source = Observable.timer(3000, 3000)
      .timeInterval()
      .pluck('interval')
      .take(10000);
    try {
      let subscription: any;
      subscription = source.subscribe(() => {
        this.oidcSecurityCommon.logDebug(this.sessionIframe);
        const session_state = this.oidcSecurityCommon.retrieve(this.oidcSecurityCommon.storage_session_state);
        if (session_state && session_state !== '') {

        }
      });
    } catch (e) {
      
    }
  }

  /**
   * Used to message handler
   * 
   * @method messageHandler
   * @private
   * @param {any} e 
   * @memberof OidcSecurityCheckSession
   */
  private messageHandler(e: any) {
    if (e.origin === this.authConfiguration.stsServer &&
      e.source === this.sessionIframe.contentWindow
    ) {
      if (e.data === 'error') {
        this.oidcSecurityCommon.logWarning('error from checksession messageHandler');
      } else if (e.data === 'changed') {
        this.onCheckSessionChanged.emit();
      } else {
        this.oidcSecurityCommon.logDebug(e.data + ' from checksession messageHandler');
      }
    }
  }

}
