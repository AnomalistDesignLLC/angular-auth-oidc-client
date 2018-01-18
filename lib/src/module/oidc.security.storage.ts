/**
 * Provides a single interface for the OidcSecurityStorage and BrowserStorage to be used in other modules
 * 
 * @file oidc.security.storage
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

/**
 * Implement this class-interface to create a custom storage.
 * 
 * @export
 * @abstract
 * @class OidcSecurityStorage
 * @property {any} read
 * @property {void} write
 */
@Injectable()
export abstract class OidcSecurityStorage {

  /**
   * This method must contain the logic to read the storage.
   * 
   * @name abstract
   * @public
   * @param key
   * @return The value of the given key
   */
  public abstract read(key: string): any;

  /**
   * This method must contain the logic to write the storage.
   * 
   * @name write
   * @public
   * @param key
   * @param value The value for the given key
   */
  public abstract write(key: string, value: any): void;

}

/**
 * Used for Browser Storage
 * 
 * @export
 * @class BrowserStorage
 * @implements {OidcSecurityStorage}
 * @property {boolean} hasStorage
 * @method read
 * @method write
 */
@Injectable()
export class BrowserStorage implements OidcSecurityStorage {

  /**
   * Used to store hasStorage
   * 
   * @name hasStorage
   * @private
   * @type {boolean}
   * @memberof BrowserStorage
   */
  private hasStorage: boolean;

  /**
   * Creates an instance of BrowserStorage.
   * 
   * @constructor
   * @param {AuthConfiguration} authConfiguration 
   * @memberof BrowserStorage
   */
  constructor(private authConfiguration: AuthConfiguration) {
    this.hasStorage = typeof Storage !== 'undefined';
  }

  /**
   * Used to read item from storage
   * 
   * @method read
   * @public
   * @param {string} key 
   * @returns {any} 
   * @memberof BrowserStorage
   */
  public read(key: string): any {
    if (this.hasStorage) {
      return JSON.parse(this.authConfiguration.storage.getItem(key));
    }

    return;
  }

  /**
   * Used to write to storage
   * 
   * @method write
   * @public
   * @param {string} key 
   * @param {any} value 
   * @memberof BrowserStorage
   */
  public write(key: string, value: any): void {
    if (this.hasStorage) {
      this.authConfiguration.storage.setItem(key, JSON.stringify(value));
    }
  }

}
