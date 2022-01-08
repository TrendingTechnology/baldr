import webpack from 'webpack';
import { gitHead } from '@bldr/core-node';
import { getConfig } from '@bldr/config';
const { DefinePlugin } = webpack;
const config = getConfig();
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
export function buildDefinePluginConfig(additionalDefinitions) {
    const defaultDefinitions = {
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config),
        gitHead: JSON.stringify(gitHead())
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
    return new DefinePlugin(Object.assign(defaultDefinitions, additionalDefinitions));
}
