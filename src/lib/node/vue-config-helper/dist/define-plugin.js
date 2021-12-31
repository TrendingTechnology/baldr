"use strict";
/**
 * ```
 * plugins: [
 *   new DefinePlugin({
 *     // https://webpack.js.org/plugins/define-plugin/
 *     // If the value is a string it will be used as a code fragment.
 *     compilationTime: new Date().getTime(),
 *     config: JSON.stringify(config),
 *     gitHead: JSON.stringify(gitHead()),
 *     songsJson: JSON.stringify(
 *       require(path.join(config.songbook.path, 'songs.json'))
 *     )
 *   })
 * ]
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDefinePluginConfig = void 0;
const webpack_1 = require("webpack");
const core_node_1 = require("@bldr/core-node");
const config_1 = require("@bldr/config");
const config = (0, config_1.getConfig)();
/**
 * Use no `JSON.stringify()`
 * Default defintions: `compilationTime`, `config`, `gitHead`
 *
 * https://webpack.js.org/plugins/define-plugin/
 * If the value is a string it will be used as a code fragment.
 *
 * @see https://webpack.js.org/plugins/define-plugin/
 */
function buildDefinePluginConfig(additionalDefinitions) {
    const defaultDefinitions = {
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config),
        gitHead: JSON.stringify((0, core_node_1.gitHead)())
    };
    for (const key in additionalDefinitions) {
        if (Object.prototype.hasOwnProperty.call(additionalDefinitions, key)) {
            additionalDefinitions[key] = JSON.stringify(additionalDefinitions[key]);
        }
    }
    return new webpack_1.DefinePlugin(Object.assign(defaultDefinitions, additionalDefinitions));
}
exports.buildDefinePluginConfig = buildDefinePluginConfig;
