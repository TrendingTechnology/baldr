/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */
import type { Configuration } from '@bldr/type-definitions';
/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
declare const config: Configuration;
export default config;
