/**
 * Provides a single interface for the JwtKeys and JwtKey to be used in other modules
 *
 * @file jwtkeys
 * @author Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 * @license MIT
 * @copyright 2017 Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 */
/**
 * Used to describe JwtKeys
 *
 * @export
 * @class JwtKeys
 * @property {JwtKey[]} keys
 */
export declare class JwtKeys {
    keys: JwtKey[];
}
/**
 * Used to describe JwtKey
 *
 * @export
 * @class JwtKey
 * @property {string} kty
 * @property {string} use
 * @property {string} kid
 * @property {string} x5t
 * @property {string} e
 * @property {string} n
 * @property {any[]} x5c
 */
export declare class JwtKey {
    kty: string;
    use: string;
    kid: string;
    x5t: string;
    e: string;
    n: string;
    x5c: any[];
}
