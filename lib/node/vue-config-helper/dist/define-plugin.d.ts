import { DefinePlugin as _DefinePlugin } from 'webpack';
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
 *   gitHead: JSON.stringify(gitHead()),
 *   songsJson: JSON.stringify(
 *     require(path.join(config.songbook.path, 'songs.json'))
 *   )
 * })
 * ```
 */
export declare function buildDefinePluginConfig(additionalDefinitions?: Record<string, any>): _DefinePlugin;
