/**
 * Provides a single interface for the OidcSecuritySilentRenew to be used in other modules
 * 
 * @file oidc.security.silent-renew
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
import { OidcSecurityCommon } from './oidc.security.common';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

/**
 * Used for OIDC Securit Silent Renewing
 * 
 * @export
 * @class OidcSecuritySilentRenew
 * @property {any} sessionIframe
 * @method initRenew
 * @method startRenew
 * @method silentLogout
 */
@Injectable()
export class OidcSecuritySilentRenew {

  /**
   * Used to store sessionIframe
   * 
   * @name sessionIframe
   * @private
   * @type {any}
   * @memberof OidcSecuritySilentRenew
   */
  private sessionIframe: any;

  /**
   * Creates an instance of OidcSecuritySilentRenew.
   * 
   * @constructor
   * @param {OidcSecurityCommon} oidcSecurityCommon 
   * @memberof OidcSecuritySilentRenew
   */
  constructor(
    private oidcSecurityCommon: OidcSecurityCommon
  ) {}

  /**
   * Used to initialize renew
   * 
   * @method initRenew
   * @returns {void}
   * @memberof OidcSecuritySilentRenew
   */
  initRenew(): void {
    const existsparent = window.parent.document.getElementById('myiFrameForSilentRenew');
    const exists = window.document.getElementById('myiFrameForSilentRenew');
    if (existsparent) {
      this.sessionIframe = existsparent;
    } else if (exists) {
      this.sessionIframe = exists;
    }

    if (!exists && !existsparent) {
      this.sessionIframe = window.document.createElement('iframe');
      this.sessionIframe.id = 'myiFrameForSilentRenew';
      this.oidcSecurityCommon.logDebug(this.sessionIframe);
      this.sessionIframe.style.display = 'none';

      window.document.body.appendChild(this.sessionIframe);
    }
  }

  /**
   * Used to start renewing
   * 
   * @method startRenew
   * @param {string} url 
   * @returns {Promise<void>} 
   * @memberof OidcSecuritySilentRenew
   */
  startRenew(url: string): Promise<void> {
    return new Promise(
      (resolve, reject) => {
        const existsparent = window.parent.document.getElementById('myiFrameForSilentRenew');
        const exists = window.document.getElementById('myiFrameForSilentRenew');
        if (existsparent) {
          this.sessionIframe = existsparent;
        } else if (exists) {
          this.sessionIframe = exists;
        }
    
        this.oidcSecurityCommon.logDebug('startRenew for URL:' + url);
        this.sessionIframe.src = url;
    
        this.sessionIframe.onload = () => {
          resolve();
        }
      }
    )
  }

  /**
   * Used for silent logout
   * 
   * @method silentLogout
   * @param {string} url 
   * @returns {Promise<void>} 
   * @memberof OidcSecuritySilentRenew
   */
  silentLogout(url: string): Promise<void> {
    return new Promise(
      (resolve, reject) => {
        const existsparent = window.parent.document.getElementById('myiFrameForSilentRenew');
        const exists = window.document.getElementById('myiFrameForSilentRenew');
        if (existsparent) {
          this.sessionIframe = existsparent;
        } else if (exists) {
          this.sessionIframe = exists;
        }
    
        this.oidcSecurityCommon.logDebug('startRenew for URL:' + url);
        this.sessionIframe.src = url;
    
        this.sessionIframe.onload = () => {
          resolve();
        }
      }
    )
  }

}
