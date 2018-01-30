import { ModuleWithProviders } from '@angular/core';
/**
 * Dependencies
 *
 * @export
 */
export { ArrayHelperService } from './module/services/oidc-array-helper.service';
export { NgModule, ModuleWithProviders } from '@angular/core';
export { OidcSecurityService } from './module/services/oidc.security.service';
export { AuthConfiguration, DefaultConfiguration } from './module/modules/auth.configuration';
export { OidcSecurityValidation } from './module/services/oidc.security.validation';
export { OidcSecurityCheckSession } from './module/services/oidc.security.check-session';
export { OidcSecuritySilentRenew } from './module/services/oidc.security.silent-renew';
export { OidcSecurityUserService } from './module/services/oidc.security.user-service';
export { OidcSecurityCommon } from './module/services/oidc.security.common';
export { OidcSecurityStorage, BrowserStorage } from './module/services/oidc.security.storage';
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
export declare class AuthModule {
    static forRoot(token?: Token): ModuleWithProviders;
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
