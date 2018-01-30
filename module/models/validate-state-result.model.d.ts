export declare class ValidateStateResult {
    access_token: string;
    id_token: string;
    authResponseIsValid: boolean;
    decoded_id_token: any;
    constructor(access_token: string, id_token: string, authResponseIsValid: boolean, decoded_id_token: any);
}
