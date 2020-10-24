/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */
import { Configuration } from '@bldr/type-definitions';
/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
declare const config: Configuration;
export = config;
