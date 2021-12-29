"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStylePaths = exports.createAliases = void 0;
const path_1 = __importDefault(require("path"));
/**
 * To void conflicting vue imports which causes
 * strange errors: “$attrs is readonly”,“$listeners is readonly”
 * https://forum.vuejs.org/t/bootstrapvue-table-attrs-is-readonly-listeners-is-readonly/73143/2
 *
 * ```js
 * module.exports = {
 *   configureWebpack: {
 *     resolve: {
 *       alias: createAliases(['vue'], __dirname)
 *     }
 *   }
 * }
 * ```
 *
 * ```js
 * configureWebpack: {
 *   resolve: {
 *     alias: {
 *        vue$: path.resolve(
 *         __dirname,
 *         'node_modules/vue/dist/vue.runtime.esm.js'
 *       )
 *     }
 *   }
 * }
 * ```
 */
function createAliases(packageNames, dirname) {
    const aliases = {};
    for (const packageName of packageNames) {
        aliases[packageName + '$'] = path_1.default.resolve(dirname, 'node_modules', packageName);
    }
    return aliases;
}
exports.createAliases = createAliases;
function stylePath(themeName) {
    return path_1.default.join(path_1.default.dirname(require.resolve('@bldr/themes')), `${themeName}.scss`);
}
/**
 * ```js
 * pluginOptions: {
 *   'style-resources-loader': {
 *     preProcessor: 'scss',
 *     patterns: [stylePath('default'), stylePath('handwriting')]
 *   }
 * }
 * ```
 */
function getStylePaths() {
    return [stylePath('default'), stylePath('handwriting')];
}
exports.getStylePaths = getStylePaths;
