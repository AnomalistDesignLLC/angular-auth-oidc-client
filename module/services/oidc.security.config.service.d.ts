import { EventEmitter } from '@angular/core';
export declare class OidcConfigService {
    onConfigurationLoaded: EventEmitter<boolean>;
    clientConfiguration: any;
    wellKnownEndpoints: any;
    constructor();
    load(configUrl: string): Promise<void>;
    load_using_stsServer(stsServer: string): Promise<void>;
    load_using_custom_stsServer(stsServer: string): Promise<void>;
}
