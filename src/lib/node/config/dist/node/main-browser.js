"use strict";
/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */
let globalConfig;
if (config != null) {
    globalConfig = config;
}
else {
    globalConfig = {};
}
module.exports = globalConfig;
