/**
 * Provides a single interface for the DefaultConfiguration, OpenIDImplicitFlowConfiguration and AuthConfiguration to be used in other modules
 * 
 * @file auth.configuration
 * @author Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 * @license MIT
 * @copyright 2017 Damien Bowden, Roberto Simonetti, Fabian Gosebrink
 */

/**
 * Dependencies
 * 
 * @import
 */
import { Injectable } from '@angular/core';

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
export class DefaultConfiguration {
  stsServer = 'https://localhost:44318';
  redirect_url = 'https://localhost:44311';
  // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
  // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
  client_id = 'angularclient';
  response_type = 'id_token token';
  // For some oidc, we require resource identifier to be provided along with the request.
  resource = '';
  scope = 'openid email profile';
  post_logout_redirect_uri = 'https://localhost:44311/unauthorized';
  start_checksession = false;
  silent_renew = true;
  startup_route = '/dataeventrecords';
  // HTTP 403
  forbidden_route = '/forbidden';
  // HTTP 401
  unauthorized_route = '/unauthorized';
  auto_userinfo = true;
  log_console_warning_active = true;
  log_console_debug_active = false;


  // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
  // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
  max_id_token_iat_offset_allowed_in_seconds = 3;
  override_well_known_configuration = false;
  override_well_known_configuration_url = 'https://localhost:44386/wellknownconfiguration.json';

  storage = typeof Storage !== 'undefined' ? sessionStorage : null;
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
export class OpenIDImplicitFlowConfiguration {
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
@Injectable()
export class AuthConfiguration {

  /**
   * Used to store openIDImplicitFlowConfiguration
   * 
   * @name openIDImplicitFlowConfiguration
   * @private
   * @type {OpenIDImplicitFlowConfiguration}
   * @memberof AuthConfiguration
   */
  private openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration;

  /**
   * Used to get stsServer
   * 
   * @method stsServer
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get stsServer(): string {
    return this.openIDImplicitFlowConfiguration.stsServer || this.defaultConfig.stsServer;
  }

  /**
   * Used to get redirect_url
   * 
   * @method redirect_url
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get redirect_url(): string {
    return this.openIDImplicitFlowConfiguration.redirect_url || this.defaultConfig.redirect_url;
  }

  /**
   * Used to get client_id
   * 
   * @method client_id
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get client_id(): string {
    return this.openIDImplicitFlowConfiguration.client_id || this.defaultConfig.client_id;
  }

  /**
   * Used to get response_type
   * 
   * @method response_type
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get response_type(): string {
    return this.openIDImplicitFlowConfiguration.response_type || this.defaultConfig.response_type;
  }

  /**
   * Used to get resource
   * 
   * @method resource
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get resource(): string {
    return this.openIDImplicitFlowConfiguration.resource || this.defaultConfig.resource;
  }

  /**
   * Used to get scope
   * 
   * @method scope
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get scope(): string {
    return this.openIDImplicitFlowConfiguration.scope || this.defaultConfig.scope;
  }

  /**
   * Used to get post_logout_redirect_uri
   * 
   * @method post_logout_redirect_uri
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get post_logout_redirect_uri(): string {
    return this.openIDImplicitFlowConfiguration.post_logout_redirect_uri || this.defaultConfig.post_logout_redirect_uri;
  }

  /**
   * Used to get start_checksession
   * 
   * @method start_checksession
   * @readonly
   * @type {boolean}
   * @memberof AuthConfiguration
   */
  get start_checksession(): boolean {
    return this.openIDImplicitFlowConfiguration.start_checksession !== undefined ? this.openIDImplicitFlowConfiguration.start_checksession : this.defaultConfig.start_checksession;
  }

  /**
   * Used to get silent_renew
   * 
   * @method silent_renew
   * @readonly
   * @type {boolean}
   * @memberof AuthConfiguration
   */
  get silent_renew(): boolean {
    return this.openIDImplicitFlowConfiguration.silent_renew !== undefined ? this.openIDImplicitFlowConfiguration.silent_renew : this.defaultConfig.silent_renew;
  }

  /**
   * Used to get startup_route
   * 
   * @method startup_route
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get startup_route(): string {
    return this.openIDImplicitFlowConfiguration.startup_route || this.defaultConfig.startup_route;
  }

  /**
   * Used to get forbidden_route
   * 
   * @method forbidden_route
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get forbidden_route(): string {
    return this.openIDImplicitFlowConfiguration.forbidden_route || this.defaultConfig.forbidden_route;
  }

  /**
   * Used to get unauthorized_route
   * 
   * @method unauthorized_route
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get unauthorized_route(): string {
    return this.openIDImplicitFlowConfiguration.unauthorized_route || this.defaultConfig.unauthorized_route;
  }

  /**
   * Used to get auto_userinfo
   * 
   * @method auto_userinfo
   * @readonly
   * @type {boolean}
   * @memberof AuthConfiguration
   */
  get auto_userinfo(): boolean {
    return this.openIDImplicitFlowConfiguration.auto_userinfo !== undefined ? this.openIDImplicitFlowConfiguration.auto_userinfo : this.defaultConfig.auto_userinfo;
  }

  /**
   * Used to get log_console_warning_active
   * 
   * @method log_console_warning_active
   * @readonly
   * @type {boolean}
   * @memberof AuthConfiguration
   */
  get log_console_warning_active(): boolean {
    return this.openIDImplicitFlowConfiguration.log_console_warning_active !== undefined ? this.openIDImplicitFlowConfiguration.log_console_warning_active : this.defaultConfig.log_console_warning_active;
  }

  /**
   * Used to get log_console_debug_active
   * 
   * @method log_console_debug_active
   * @readonly
   * @type {boolean}
   * @memberof AuthConfiguration
   */
  get log_console_debug_active(): boolean {
    return this.openIDImplicitFlowConfiguration.log_console_debug_active !== undefined ? this.openIDImplicitFlowConfiguration.log_console_debug_active : this.defaultConfig.log_console_debug_active;
  }

  /**
   * Used to get max_id_token_iat_offset_allowed_in_seconds
   * 
   * @method max_id_token_iat_offset_allowed_in_seconds
   * @readonly
   * @type {number}
   * @memberof AuthConfiguration
   */
  get max_id_token_iat_offset_allowed_in_seconds(): number {
    return this.openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds || this.defaultConfig.max_id_token_iat_offset_allowed_in_seconds;
  }

  /**
   * Used to get override_well_known_configuration
   * 
   * @method override_well_known_configuration
   * @readonly
   * @type {boolean}
   * @memberof AuthConfiguration
   */
  get override_well_known_configuration(): boolean {
    return this.openIDImplicitFlowConfiguration.override_well_known_configuration !== undefined ? this.openIDImplicitFlowConfiguration.override_well_known_configuration : this.defaultConfig.override_well_known_configuration;
  }

  /**
   * Used to get override_well_known_configuration_url
   * 
   * @method override_well_known_configuration_url
   * @readonly
   * @type {string}
   * @memberof AuthConfiguration
   */
  get override_well_known_configuration_url(): string {
    return this.openIDImplicitFlowConfiguration.override_well_known_configuration_url || this.defaultConfig.override_well_known_configuration_url;
  }

  /**
   * Used to get storage
   * 
   * @method storage
   * @readonly
   * @type {any}
   * @memberof AuthConfiguration
   */
  get storage(): any {
    return this.openIDImplicitFlowConfiguration.storage || this.defaultConfig.storage;
  }

  /**
   * Creates an instance of AuthConfiguration.
   * 
   * @constructor
   * @param {DefaultConfiguration} defaultConfig 
   * @memberof AuthConfiguration
   */
  constructor(private defaultConfig: DefaultConfiguration) { }

  /**
   * initialize openIDImplicitFlowConfiguration
   * 
   * @method init
   * @public
   * @param {OpenIDImplicitFlowConfiguration} openIDImplicitFlowConfiguration 
   * @memberof AuthConfiguration
   */
  public init(openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration) {
    this.openIDImplicitFlowConfiguration = openIDImplicitFlowConfiguration;
  }
}
