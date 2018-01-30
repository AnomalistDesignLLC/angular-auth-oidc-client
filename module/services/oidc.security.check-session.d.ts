import { EventEmitter } from '@angular/core';
import { AuthConfiguration } from '../modules/auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';
import { LoggerService } from './oidc.logger.service';
import { AuthWellKnownEndpoints } from '../models/auth.well-known-endpoints';
export declare class OidcSecurityCheckSession {
    private authConfiguration;
    private oidcSecurityCommon;
    private loggerService;
    private sessionIframe;
    private iframeMessageEvent;
    private authWellKnownEndpoints;
    onCheckSessionChanged: EventEmitter<any>;
    constructor(authConfiguration: AuthConfiguration, oidcSecurityCommon: OidcSecurityCommon, loggerService: LoggerService);
    setupModule(authWellKnownEndpoints: AuthWellKnownEndpoints): void;
    doesSessionExist(): boolean;
    init(): any;
    pollServerSession(clientId: any): void;
    private messageHandler(e);
}
