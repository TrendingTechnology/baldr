import path from 'path'
import fs from 'fs'

/**
 * To void conflicting vue imports which causes
 * strange errors: “$attrs is readonly”,“$listeners is readonly”
 * https://forum.vuejs.org/t/bootstrapvue-table-attrs-is-readonly-listeners-is-readonly/73143/2
 *
 * ```js
 * module.exports = {
 *   configureWebpack: {
 *     resolve: {
 *       alias: createAliases(['vue'], new URL('.', import.meta.url).pathname)
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
 *         new URL('.', import.meta.url).pathname,
 *         'node_modules/vue/dist/vue.runtime.esm.js'
 *       )
 *     }
 *   }
 * }
 * ```
 */
function createAliases (
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

/**
 * Search for packages that can be used as aliases in the webpack configuration.
 *
 * @param dirname - Directory path of a package. The package must have
 *   a `node_modules` subfolder.
 *
 * @returns For example
 *
 * ```js
 * {
 *   vue$: './node_modules/vue/dist/vue.runtime.esm.js'
 * }
 * ```
 */
export function searchForAliases (dirname: string): Record<string, string> {
  const nodeModulesDir = path.join(dirname, 'node_modules')

  // baldr: To avoid duplicates in the webpack builds
  const baldrDir = path.join(nodeModulesDir, '@bldr')
  const packageNames: string[] = []
  if (fs.existsSync(baldrDir)) {
    for (const baldrPackageName of fs.readdirSync(baldrDir)) {
      packageNames.push(path.join('@bldr', baldrPackageName))
    }
  }

  // vue: To avoid conflicting imports
  const vuePackages = [
    'vue',
    'vuex',
    'vue-router',
    'vue-class-component',
    'vue-property-decorator'
  ]
  for (const vuePackage of vuePackages) {
    if (fs.existsSync(path.join(nodeModulesDir, vuePackage))) {
      packageNames.push(vuePackage)
    }
  }
  return createAliases(packageNames, dirname)
}
