import { AuthConfiguration } from '../modules/auth.configuration';
export declare class LoggerService {
    private authConfiguration;
    constructor(authConfiguration: AuthConfiguration);
    logError(message: any): void;
    logWarning(message: any): void;
    logDebug(message: any): void;
}
