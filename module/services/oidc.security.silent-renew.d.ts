import { LoggerService } from './oidc.logger.service';
export declare class OidcSecuritySilentRenew {
    private loggerService;
    private sessionIframe;
    private sessionIframeLogout;
    private _checkForIFrameLogoutSrc;
    constructor(loggerService: LoggerService);
    logout(url: string): any;
    logoutIFrameCleanUp(): void;
    removeiFrameForSilentLogout(): void;
    initRenew(): void;
    startRenew(url: string): any;
}
