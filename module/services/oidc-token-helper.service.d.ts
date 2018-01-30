export declare class TokenHelperService {
    constructor();
    getTokenExpirationDate(dataIdToken: any): Date;
    getPayloadFromToken(token: any, encode: boolean): any;
    getHeaderFromToken(token: any, encode: boolean): any;
    getSignatureFromToken(token: any, encode: boolean): any;
    urlBase64Decode(str: string): string;
}
