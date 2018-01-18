/**
 * Used to describe DefaultConfiguration
 *
 * @export
 * @class DefaultConfiguration
 * @property {string} stsServer
 * @property {string} redirect_url
 * @property {string} client_id
 * @property {string} response_type
 * @property {string} resource
 * @property {string} scope
 * @property {string} post_logout_redirect_uri
 * @property {boolean} start_checksession
 * @property {boolean} silent_renew
 * @property {string} startup_route
 * @property {string} forbidden_route
 * @property {string} unauthorized_route
 * @property {boolean} auto_userinfo
 * @property {boolean} log_console_warning_active
 * @property {boolean} log_console_debug_active
 * @property {number} max_id_token_iat_offset_allowed_in_seconds
 * @property {boolean} override_well_known_configuration
 * @property {string} override_well_known_configuration_url
 * @property {any} storage
 */
export declare class DefaultConfiguration {
    stsServer: string;
    redirect_url: string;
    client_id: string;
    response_type: string;
    resource: string;
    scope: string;
    post_logout_redirect_uri: string;
    start_checksession: boolean;
    silent_renew: boolean;
    startup_route: string;
    forbidden_route: string;
    unauthorized_route: string;
    auto_userinfo: boolean;
    log_console_warning_active: boolean;
    log_console_debug_active: boolean;
    max_id_token_iat_offset_allowed_in_seconds: number;
    override_well_known_configuration: boolean;
    override_well_known_configuration_url: string;
    storage: Storage;
}
/**
 * Used to describe OpenIDImplicitFlowConfiguration
 *
 * @export
 * @class OpenIDImplicitFlowConfiguration
 * @property {string} stsServer
 * @property {string} redirect_url
 * @property {string} client_id
 * @property {string} response_type
 * @property {string} resource
 * @property {string} scope
 * @property {string} post_logout_redirect_uri
 * @property {string} start_checksession
 * @property {string} silent_renew
 * @property {string} startup_route
 * @property {string} forbidden_route
 * @property {string} unauthorized_route
 * @property {string} auto_userinfo
 * @property {string} log_console_warning_active
 * @property {string} log_console_debug_active
 * @property {string} max_id_token_iat_offset_allowed_in_seconds
 * @property {string} override_well_known_configuration
 * @property {string} override_well_known_configuration_url
 * @property {string} storage
 */
export declare class OpenIDImplicitFlowConfiguration {
    stsServer: string;
    redirect_url: string;
    client_id: string;
    response_type: string;
    resource: string;
    scope: string;
    post_logout_redirect_uri: string;
    start_checksession: boolean;
    silent_renew: boolean;
    startup_route: string;
    forbidden_route: string;
    unauthorized_route: string;
    auto_userinfo: boolean;
    log_console_warning_active: boolean;
    log_console_debug_active: boolean;
    max_id_token_iat_offset_allowed_in_seconds: number;
    override_well_known_configuration: boolean;
    override_well_known_configuration_url: string;
    storage: any;
}
/**
 * The Auth Configuration
 *
 * @export
 * @class AuthConfiguration
 */
export declare class AuthConfiguration {
    private defaultConfig;
    /**
     * Used to store openIDImplicitFlowConfiguration
     *
     * @name openIDImplicitFlowConfiguration
     * @private
     * @type {OpenIDImplicitFlowConfiguration}
     * @memberof AuthConfiguration
     */
    private openIDImplicitFlowConfiguration;
    /**
     * Used to get stsServer
     *
     * @method stsServer
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly stsServer: string;
    /**
     * Used to get redirect_url
     *
     * @method redirect_url
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly redirect_url: string;
    /**
     * Used to get client_id
     *
     * @method client_id
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly client_id: string;
    /**
     * Used to get response_type
     *
     * @method response_type
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly response_type: string;
    /**
     * Used to get resource
     *
     * @method resource
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly resource: string;
    /**
     * Used to get scope
     *
     * @method scope
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly scope: string;
    /**
     * Used to get post_logout_redirect_uri
     *
     * @method post_logout_redirect_uri
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly post_logout_redirect_uri: string;
    /**
     * Used to get start_checksession
     *
     * @method start_checksession
     * @readonly
     * @type {boolean}
     * @memberof AuthConfiguration
     */
    readonly start_checksession: boolean;
    /**
     * Used to get silent_renew
     *
     * @method silent_renew
     * @readonly
     * @type {boolean}
     * @memberof AuthConfiguration
     */
    readonly silent_renew: boolean;
    /**
     * Used to get startup_route
     *
     * @method startup_route
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly startup_route: string;
    /**
     * Used to get forbidden_route
     *
     * @method forbidden_route
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly forbidden_route: string;
    /**
     * Used to get unauthorized_route
     *
     * @method unauthorized_route
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly unauthorized_route: string;
    /**
     * Used to get auto_userinfo
     *
     * @method auto_userinfo
     * @readonly
     * @type {boolean}
     * @memberof AuthConfiguration
     */
    readonly auto_userinfo: boolean;
    /**
     * Used to get log_console_warning_active
     *
     * @method log_console_warning_active
     * @readonly
     * @type {boolean}
     * @memberof AuthConfiguration
     */
    readonly log_console_warning_active: boolean;
    /**
     * Used to get log_console_debug_active
     *
     * @method log_console_debug_active
     * @readonly
     * @type {boolean}
     * @memberof AuthConfiguration
     */
    readonly log_console_debug_active: boolean;
    /**
     * Used to get max_id_token_iat_offset_allowed_in_seconds
     *
     * @method max_id_token_iat_offset_allowed_in_seconds
     * @readonly
     * @type {number}
     * @memberof AuthConfiguration
     */
    readonly max_id_token_iat_offset_allowed_in_seconds: number;
    /**
     * Used to get override_well_known_configuration
     *
     * @method override_well_known_configuration
     * @readonly
     * @type {boolean}
     * @memberof AuthConfiguration
     */
    readonly override_well_known_configuration: boolean;
    /**
     * Used to get override_well_known_configuration_url
     *
     * @method override_well_known_configuration_url
     * @readonly
     * @type {string}
     * @memberof AuthConfiguration
     */
    readonly override_well_known_configuration_url: string;
    /**
     * Used to get storage
     *
     * @method storage
     * @readonly
     * @type {any}
     * @memberof AuthConfiguration
     */
    readonly storage: any;
    /**
     * Creates an instance of AuthConfiguration.
     *
     * @constructor
     * @param {DefaultConfiguration} defaultConfig
     * @memberof AuthConfiguration
     */
    constructor(defaultConfig: DefaultConfiguration);
    /**
     * initialize openIDImplicitFlowConfiguration
     *
     * @method init
     * @public
     * @param {OpenIDImplicitFlowConfiguration} openIDImplicitFlowConfiguration
     * @memberof AuthConfiguration
     */
    init(openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration): void;
}
