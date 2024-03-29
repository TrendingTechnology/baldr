"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStyleResourcesLoaderConfig = void 0;
const path_1 = __importDefault(require("path"));
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
function stylePath(themeName) {
    return path_1.default.join(path_1.default.dirname(require.resolve('@bldr/themes')), `${themeName}.scss`);
}
/**
 * ```js
 * 'style-resources-loader': {
 *   patterns: [
 *     '.../baldr/src/vue/plugins/themes/src/default.scss',
 *     '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *   ]
 * }
 * ```
 */
function getStylePaths() {
    return [stylePath('default'), stylePath('handwriting')];
}
/**
 * Usage:
 *
 * ```js
 * pluginOptions: {
 *   'style-resources-loader': buildStyleResourcesLoaderConfig()
 * }
 * ```
 *
 * @see https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
 *
 * @returns For example:
 *
 *  * ```js
 * {
 *   preProcessor: 'scss',
 *   patterns: [
 *     '.../baldr/src/vue/plugins/themes/src/default.scss',
 *     '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *   ]
 * }
 * ```
 */
function buildStyleResourcesLoaderConfig() {
    return {
        preProcessor: 'scss',
        patterns: getStylePaths()
    };
}
exports.buildStyleResourcesLoaderConfig = buildStyleResourcesLoaderConfig;
