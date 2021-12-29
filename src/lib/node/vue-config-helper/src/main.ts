import path from 'path'

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
export function createAliases (
  packageNames: string[],
  dirname: string
): Record<string, string> {
  const aliases: Record<string, string> = {}

  for (const packageName of packageNames) {
    aliases[packageName + '$'] = path.resolve(
      dirname,
      'node_modules',
      packageName
    )
  }

  return aliases
}
