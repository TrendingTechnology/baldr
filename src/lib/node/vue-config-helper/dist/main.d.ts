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
export declare function createAliases(packageNames: string[], dirname: string): Record<string, string>;
/**
 * Search for packages that can be used as aliases in the webpack configuration.
 *
 * @param dirname - Directory path of a package. The package must habe
 *   a `node_modules` subfolder.
 */
export declare function searchForAliases(dirname: string): Record<string, string>;
/**
 * ```js
 * pluginOptions: {
 *   'style-resources-loader': {
 *     preProcessor: 'scss',
 *     patterns: [
 *       '.../baldr/src/vue/plugins/themes/src/default.scss',
 *       '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *     ]
 *   }
 * }
 * ```
 */
export declare function getStylePaths(): string[];
interface MasterExamples {
    common: Record<string, string>;
    masters: Record<string, string>;
}
export declare function readMasterExamples(): MasterExamples;
export {};
