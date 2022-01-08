"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDefinePluginConfig = void 0;
const webpack_1 = require("webpack");
const git_head_info_1 = __importDefault(require("@bldr/git-head-info"));
const config_cjs_1 = __importDefault(require("@bldr/config-cjs"));
/**
 * Use no `JSON.stringify()`
 * Default defintions: `compilationTime`, `config`, `gitHead`
 *
 * If the value is a string it will be used as a code fragment.
 *
 * @see https://webpack.js.org/plugins/define-plugin/
 *
 * @returns For example
 *
 * ```js
 * new DefinePlugin({
 *   // https://webpack.js.org/plugins/define-plugin/
 *   // If the value is a string it will be used as a code fragment.
 *   compilationTime: new Date().getTime(),
 *   config: JSON.stringify(config),
 *   gitHead: JSON.stringify(getGitHead()),
 *   songsJson: JSON.stringify(
 *     require(path.join(config.songbook.path, 'songs.json'))
 *   )
 * })
 * ```
 */
function buildDefinePluginConfig(additionalDefinitions) {
    const defaultDefinitions = {
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config_cjs_1.default),
        gitHead: JSON.stringify({
            long: git_head_info_1.default.long(),
            short: git_head_info_1.default.short(),
            isDirty: git_head_info_1.default.isDirty()
        })
    };
    if (additionalDefinitions != null) {
        for (const key in additionalDefinitions) {
            if (Object.prototype.hasOwnProperty.call(additionalDefinitions, key)) {
                additionalDefinitions[key] = JSON.stringify(additionalDefinitions[key]);
            }
        }
    }
    else {
        additionalDefinitions = {};
    }
    return new webpack_1.DefinePlugin(Object.assign(defaultDefinitions, additionalDefinitions));
}
exports.buildDefinePluginConfig = buildDefinePluginConfig;
