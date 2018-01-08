import { NgModule, ModuleWithProviders } from '@angular/core';

import { OidcSecurityService } from '../';
import { AuthConfiguration, DefaultConfiguration } from './auth.configuration';
import { OidcSecurityValidation } from '../';
import { OidcSecurityCheckSession } from '../';
import { OidcSecuritySilentRenew } from '../';
import { OidcSecurityUserService } from '../';
import { OidcSecurityCommon } from '../';
import { OidcSecurityStorage, BrowserStorage } from '../';
import { AuthWellKnownEndpoints } from '../';

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
