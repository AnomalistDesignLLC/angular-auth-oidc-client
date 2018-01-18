/**
 * Provides a single interface for the angular-auth-oidc-client Module to be used in other modules
 *
 * @file index
 * @author Matthew Aaron Raymer <matthew.raymer@anomalistdesign.com>
 * @license UNLICENSED
 * @copyright Qpons 2017
 */
/**
 * Dependencies
 *
 * @import
 */
import { ModuleWithProviders } from '@angular/core';
/**
 * Dependencies
 *
 * @export
 */
export { NgModule, ModuleWithProviders } from '@angular/core';
export { OidcSecurityService } from './module/oidc.security.service';
export { OidcSecurityValidation } from './module/oidc.security.validation';
export { OidcSecurityCheckSession } from './module/oidc.security.check-session';
export { OidcSecuritySilentRenew } from './module/oidc.security.silent-renew';
export { OidcSecurityUserService } from './module/oidc.security.user-service';
export { OidcSecurityCommon } from './module/oidc.security.common';
export { OidcSecurityStorage, BrowserStorage } from './module/oidc.security.storage';
export { AuthWellKnownEndpoints } from './module/auth.well-known-endpoints';
export { AuthConfiguration, OpenIDImplicitFlowConfiguration, DefaultConfiguration } from './module/auth.configuration';
/**
 * AAOC Module
 *
 * @export
 * @class AuthModule
 */
export declare class AuthModule {
    static forRoot(token?: Token): ModuleWithProviders;
    static forChild(token?: Token): ModuleWithProviders;
}
/**
 * Interface for Type<T>
 *
 * @export
 * @interface Type
 * @extends {Function}
 * @template T
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Interface for Token
 *
 * @export
 * @interface Token
 */
export interface Token {
    storage?: Type<any>;
}
