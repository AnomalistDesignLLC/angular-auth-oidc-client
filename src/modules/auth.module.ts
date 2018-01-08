import { NgModule, ModuleWithProviders } from '@angular/core';

import { OidcSecurityService } from '../angular-auth-oidc-client';
import { AuthConfiguration, DefaultConfiguration } from './auth.configuration';
import { OidcSecurityValidation } from '../angular-auth-oidc-client';
import { OidcSecurityCheckSession } from '../angular-auth-oidc-client';
import { OidcSecuritySilentRenew } from '../angular-auth-oidc-client';
import { OidcSecurityUserService } from '../angular-auth-oidc-client';
import { OidcSecurityCommon } from '../angular-auth-oidc-client';
import { OidcSecurityStorage, BrowserStorage } from '../angular-auth-oidc-client';
import { AuthWellKnownEndpoints } from '../angular-auth-oidc-client';

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

export interface Type<T> extends Function {

    new (...args: any[]): T;

}

export interface Token {

    storage?: Type<any>;

}
