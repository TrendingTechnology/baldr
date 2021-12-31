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
import { DefinePlugin } from 'webpack';
/**
 * https://webpack.js.org/plugins/define-plugin/
 * If the value is a string it will be used as a code fragment.
 *
 * @see https://webpack.js.org/plugins/define-plugin/
 */
export declare function buildDefinePluginConfig(additionalDefinitions: Record<string, any>): DefinePlugin;
