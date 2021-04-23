/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */

import { Configuration } from '@bldr/type-definitions'

let globalConfig: Configuration

if (config != null) {
  globalConfig = config
} else {
  globalConfig = {} as Configuration
}

export = globalConfig
