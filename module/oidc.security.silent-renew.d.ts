import { OidcSecurityCommon } from './oidc.security.common';
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
export declare class OidcSecuritySilentRenew {
    private oidcSecurityCommon;
    /**
     * Used to store sessionIframe
     *
     * @name sessionIframe
     * @private
     * @type {any}
     * @memberof OidcSecuritySilentRenew
     */
    private sessionIframe;
    /**
     * Creates an instance of OidcSecuritySilentRenew.
     *
     * @constructor
     * @param {OidcSecurityCommon} oidcSecurityCommon
     * @memberof OidcSecuritySilentRenew
     */
    constructor(oidcSecurityCommon: OidcSecurityCommon);
    /**
     * Used to initialize renew
     *
     * @method initRenew
     * @returns {void}
     * @memberof OidcSecuritySilentRenew
     */
    initRenew(): void;
    /**
     * Used to start renewing
     *
     * @method startRenew
     * @param {string} url
     * @returns {Promise<void>}
     * @memberof OidcSecuritySilentRenew
     */
    startRenew(url: string): Promise<void>;
    /**
     * Used for silent logout
     *
     * @method silentLogout
     * @param {string} url
     * @returns {Promise<void>}
     * @memberof OidcSecuritySilentRenew
     */
    silentLogout(url: string): Promise<void>;
}
