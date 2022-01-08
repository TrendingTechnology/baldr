"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDefinePluginConfig = void 0;
const webpack_1 = require("webpack");
const coreNode = await Promise.resolve().then(() => __importStar(require('@bldr/core-node')));
const c = await Promise.resolve().then(() => __importStar(require('@bldr/config')));
const config = c.default.getConfig();
const getGitHead = coreNode.default.getGitHead;
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
        config: JSON.stringify(config),
        gitHead: JSON.stringify(getGitHead())
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
