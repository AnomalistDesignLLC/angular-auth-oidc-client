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
export declare abstract class OidcSecurityStorage {
    /**
     * This method must contain the logic to read the storage.
     *
     * @name abstract
     * @public
     * @param key
     * @return The value of the given key
     */
    abstract read(key: string): any;
    /**
     * This method must contain the logic to write the storage.
     *
     * @name write
     * @public
     * @param key
     * @param value The value for the given key
     */
    abstract write(key: string, value: any): void;
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
export declare class BrowserStorage implements OidcSecurityStorage {
    private authConfiguration;
    /**
     * Used to store hasStorage
     *
     * @name hasStorage
     * @private
     * @type {boolean}
     * @memberof BrowserStorage
     */
    private hasStorage;
    /**
     * Creates an instance of BrowserStorage.
     *
     * @constructor
     * @param {AuthConfiguration} authConfiguration
     * @memberof BrowserStorage
     */
    constructor(authConfiguration: AuthConfiguration);
    /**
     * Used to read item from storage
     *
     * @method read
     * @public
     * @param {string} key
     * @returns {any}
     * @memberof BrowserStorage
     */
    read(key: string): any;
    /**
     * Used to write to storage
     *
     * @method write
     * @public
     * @param {string} key
     * @param {any} value
     * @memberof BrowserStorage
     */
    write(key: string, value: any): void;
}
