import { LoggerService } from './oidc.logger.service';
export declare class OidcSecuritySilentRenew {
    private loggerService;
    private sessionIframe;
    constructor(loggerService: LoggerService);
    initRenew(): void;
    startRenew(url: string): any;
}
