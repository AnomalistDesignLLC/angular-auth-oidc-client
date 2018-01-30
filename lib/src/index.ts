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
import { ArrayHelperService } from './module/services/oidc-array-helper.service';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { OidcSecurityService } from './module/services/oidc.security.service';
import { AuthConfiguration, DefaultConfiguration, OpenIDImplicitFlowConfiguration } from './module/modules/auth.configuration';
import { OidcSecurityValidation } from './module/services/oidc.security.validation';
import { OidcSecurityCheckSession } from './module/services/oidc.security.check-session';
import { OidcSecuritySilentRenew } from './module/services/oidc.security.silent-renew';
import { OidcSecurityUserService } from './module/services/oidc.security.user-service';
import { OidcSecurityCommon } from './module/services/oidc.security.common';
import {
    OidcSecurityStorage,
    BrowserStorage
} from './module/services/oidc.security.storage';
import { StateValidationService } from './module/services/oidc-security-state-validation.service';
import { OidcDataService } from './module/services/oidc-data.service';
import { TokenHelperService } from './module/services/oidc-token-helper.service';
import { LoggerService } from './module/services/oidc.logger.service';
import { OidcConfigService } from './module/services/oidc.security.config.service';
import { AuthWellKnownEndpoints } from './module/models/auth.well-known-endpoints';

/**
 * Dependencies
 * 
 * @export
 */
export { ArrayHelperService } from './module/services/oidc-array-helper.service';
export { NgModule, ModuleWithProviders } from '@angular/core';

export { OidcSecurityService } from './module/services/oidc.security.service';
export { AuthConfiguration, DefaultConfiguration, OpenIDImplicitFlowConfiguration } from './module/modules/auth.configuration';
export { OidcSecurityValidation } from './module/services/oidc.security.validation';
export { OidcSecurityCheckSession } from './module/services/oidc.security.check-session';
export { OidcSecuritySilentRenew } from './module/services/oidc.security.silent-renew';
export { OidcSecurityUserService } from './module/services/oidc.security.user-service';
export { OidcSecurityCommon } from './module/services/oidc.security.common';
export {
    OidcSecurityStorage,
    BrowserStorage
} from './module/services/oidc.security.storage';
export { StateValidationService } from './module/services/oidc-security-state-validation.service';
export { OidcDataService } from './module/services/oidc-data.service';
export { TokenHelperService } from './module/services/oidc-token-helper.service';
export { LoggerService } from './module/services/oidc.logger.service';
export { OidcConfigService } from './module/services/oidc.security.config.service';
export { AuthWellKnownEndpoints } from './module/models/auth.well-known-endpoints';

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
                OidcConfigService,
                OidcSecurityService,
                OidcSecurityValidation,
                OidcSecurityCheckSession,
                OidcSecuritySilentRenew,
                OidcSecurityUserService,
                OidcSecurityCommon,
                AuthConfiguration,
                TokenHelperService,
                LoggerService,
                DefaultConfiguration,
                ArrayHelperService,
                AuthWellKnownEndpoints,
                OidcDataService,
                StateValidationService,
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
