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
import { NgModule, ModuleWithProviders } from '@angular/core';
import { OidcSecurityService } from './module/oidc.security.service';
import { OidcSecurityValidation } from './module/oidc.security.validation';
import { OidcSecurityCheckSession } from './module/oidc.security.check-session';
import { OidcSecuritySilentRenew } from './module/oidc.security.silent-renew';
import { OidcSecurityUserService } from './module/oidc.security.user-service';
import { OidcSecurityCommon } from './module/oidc.security.common';
import { OidcSecurityStorage, BrowserStorage } from './module/oidc.security.storage';
import { AuthWellKnownEndpoints } from './module/auth.well-known-endpoints';
import { AuthConfiguration, OpenIDImplicitFlowConfiguration, DefaultConfiguration } from './module/auth.configuration';

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
@NgModule()
export class AuthModule {
    static forRoot(token: Token = {}): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                OidcSecurityService,
                OidcSecurityValidation,
                OidcSecurityCheckSession,
                OidcSecuritySilentRenew,
                OidcSecurityUserService,
                OidcSecurityCommon,
                AuthConfiguration,
                DefaultConfiguration,
                AuthWellKnownEndpoints,
                {
                    provide: OidcSecurityStorage,
                    useClass: token.storage || BrowserStorage
                }
            ]
        };
    }

    public static forChild(token: Token = {}): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                OidcSecurityService,
                OidcSecurityValidation,
                OidcSecurityCheckSession,
                OidcSecuritySilentRenew,
                OidcSecurityUserService,
                OidcSecurityCommon,
                AuthConfiguration,
                AuthWellKnownEndpoints,
                {
                    provide: OidcSecurityStorage,
                    useClass: token.storage || BrowserStorage
                }
            ]
        };
    }
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
