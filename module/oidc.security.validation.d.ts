import { OidcSecurityCommon } from './oidc.security.common';
/**
 * http://openid.net/specs/openid-connect-implicit-1_0.html
 *
 *id_token
 *id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
 *id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
 *id_token C3: If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
 *id_token C4: If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
 *id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg Header Parameter of the JOSE Header. The Client MUST use the keys provided by the Issuer.
 *id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect Core 1.0 [OpenID.Core] specification.
 *id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
 *id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time, limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
 *id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks is Client specific.
 *id_token C10: If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate.The meaning and processing of acr Claim Values is out of scope for this document.
 *id_token C11: When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re- authentication if it determines too much time has elapsed since the last End- User authentication.
 *
 *Access Token Validation
 *access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA] for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
 *access_token C2: Take the left- most half of the hash and base64url- encode it.
 *access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present in the ID Token.
 *
 * @export
 * @class OidcSecurityValidation
 * @method isTokenExpired
 * @method validate_id_token_exp_not_expired
 * @method validate_required_id_token
 * @method validate_id_token_iat_max_offset
 * @method validate_id_token_nonce
 * @method validate_id_token_iss
 * @method validate_id_token_aud
 * @method validateStateFromHashCallback
 * @method validate_userdata_sub_id_token
 * @method getPayloadFromToken
 * @method getHeaderFromToken
 * @method getSignatureFromToken
 * @method validate_signature_id_token
 * @method config_validate_response_type
 * @method validate_id_token_at_hash
 * @method generate_at_hash
 * @method getTokenExpirationDate
 * @method urlBase64Decode
 */
export declare class OidcSecurityValidation {
    private oidcSecurityCommon;
    /**
     * Creates an instance of OidcSecurityValidation.
     *
     * @constructor
     * @param {OidcSecurityCommon} oidcSecurityCommon
     * @memberof OidcSecurityValidation
     */
    constructor(oidcSecurityCommon: OidcSecurityCommon);
    /**
     * id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
     *
     * @method isTokenExpired
     * @public
     * @param {string} token
     * @param {number} [offsetSeconds]
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    isTokenExpired(token: string, offsetSeconds?: number): boolean;
    /**
     * id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
     *
     * @method validate_id_token_exp_not_expired
     * @public
     * @param {string} decoded_id_token
     * @param {number} [offsetSeconds]
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_id_token_exp_not_expired(decoded_id_token: string, offsetSeconds?: number): boolean;
    /**
     * iss
     *
     * REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the https scheme that contains scheme, host,
     * and optionally, port number and path components and no query or fragment components.
     *
     * sub
     * REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
     * which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
     * It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
     *
     * aud
     * REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an audience value.
     * It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
     * In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
     *
     * exp
     * REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
     * The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
     * Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
     * Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until the date/ time.
     * See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
     *
     * iat
     * REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured
     * in UTC until the date/ time.
     *
     * @method validate_required_id_token
     * @public
     * @param {any} dataIdToken
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_required_id_token(dataIdToken: any): boolean;
    /**
     * id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
     *
     * limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
     *
     * @method validate_id_token_iat_max_offset
     * @public
     * @param {any} dataIdToken
     * @param {number} max_offset_allowed_in_seconds
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_id_token_iat_max_offset(dataIdToken: any, max_offset_allowed_in_seconds: number): boolean;
    /**
     * id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks is Client specific.
     *
     * @method validate_id_token_nonce
     * @public
     * @param {any} dataIdToken
     * @param {any} local_nonce
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_id_token_nonce(dataIdToken: any, local_nonce: any): boolean;
    /**
     * id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
     *
     * @method validate_id_token_iss
     * @public
     * @param {any} dataIdToken
     * @param {any} authWellKnownEndpoints_issuer
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_id_token_iss(dataIdToken: any, authWellKnownEndpoints_issuer: any): boolean;
    /**
     * id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
     *
     * The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
     *
     * @method validate_id_token_aud
     * @public
     * @param {any} dataIdToken
     * @param {any} aud
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_id_token_aud(dataIdToken: any, aud: any): boolean;
    /**
     * Used to validate state from hash callback
     *
     * @method validateStateFromHashCallback
     * @param {any} state
     * @param {any} local_state
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validateStateFromHashCallback(state: any, local_state: any): boolean;
    /**
     * Used to validate userdate sub id token
     *
     * @method validate_userdata_sub_id_token
     * @param {any} id_token_sub
     * @param {any} userdata_sub
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_userdata_sub_id_token(id_token_sub: any, userdata_sub: any): boolean;
    /**
     * Used to get payload from token
     *
     * @method getPayloadFromToken
     * @param {any} token
     * @param {boolean} encode
     * @returns
     * @memberof OidcSecurityValidation
     */
    getPayloadFromToken(token: any, encode: boolean): any;
    /**
     * Used to get header from token
     *
     * @method getHeaderFromToken
     * @param {any} token
     * @param {boolean} encode
     * @returns
     * @memberof OidcSecurityValidation
     */
    getHeaderFromToken(token: any, encode: boolean): any;
    /**
     * Used to get signature from token
     *
     * @method getSignatureFromToken
     * @param {any} token
     * @param {boolean} encode
     * @returns {any}
     * @memberof OidcSecurityValidation
     */
    getSignatureFromToken(token: any, encode: boolean): any;
    /**
     * id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg Header Parameter of the JOSE Header. The Client MUST use the keys provided by the Issuer.
     *
     * id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect Core 1.0 [OpenID.Core] specification.
     *
     * @method validate_signature_id_token
     * @public
     * @param {any} id_token
     * @param {any} jwtkeys
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_signature_id_token(id_token: any, jwtkeys: any): boolean;
    /**
     * Used to config validate response type
     *
     * @method config_validate_response_type
     * @param {string} response_type
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    config_validate_response_type(response_type: string): boolean;
    /**
     * Access Token Validation
     *
     * access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA] for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
     * access_token C2: Take the left- most half of the hash and base64url- encode it.
     * access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present in the ID Token.
     *
     * @method validate_id_token_at_hash
     * @public
     * @param {any} access_token
     * @param {any} at_hash
     * @returns {boolean}
     * @memberof OidcSecurityValidation
     */
    validate_id_token_at_hash(access_token: any, at_hash: any): boolean;
    /**
     * Used to generate at hash
     *
     * @method generate_at_hash
     * @private
     * @param {any} access_token
     * @returns {string}
     * @memberof OidcSecurityValidation
     */
    private generate_at_hash(access_token);
    /**
     * Used to get token expiration date
     *
     * @method getTokenExpirationDate
     * @private
     * @param {any} dataIdToken
     * @returns {Date}
     * @memberof OidcSecurityValidation
     */
    private getTokenExpirationDate(dataIdToken);
    /**
     * Used to decode url base64
     *
     * @method urlBase64Decode
     * @private
     * @param {string} str
     * @returns {any}
     * @memberof OidcSecurityValidation
     */
    private urlBase64Decode(str);
}
