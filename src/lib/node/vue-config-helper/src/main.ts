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

function stylePath (themeName: 'default' | 'handwriting'): string {
  return path.join(
    path.dirname(require.resolve('@bldr/themes')),
    `${themeName}.scss`
  )
}

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
export function getStylePaths (): string[] {
  return [stylePath('default'), stylePath('handwriting')]
}

interface MasterExamples {
  common: Record<string, string>
  masters: Record<string, string>
}

export function readMasterExamples (): MasterExamples {
  function getBaseName (filePath: string): string {
    return filePath.replace('.baldr.yml', '')
  }

  const examples: MasterExamples = {
    common: {},
    masters: {}
  }

  const basePath = path.join(
    require
      .resolve('@bldr/presentation-parser')
      .replace('/dist/node/main.js', ''),
    'tests',
    'files'
  )

  // common
  const commonBasePath = path.join(basePath, 'common')
  for (const exampleFile of fs.readdirSync(commonBasePath)) {
    if (exampleFile.match(/\.baldr\.yml$/) != null) {
      const rawYaml = fs.readFileSync(
        path.join(commonBasePath, exampleFile),
        'utf8'
      )
      examples.common[getBaseName(exampleFile)] = rawYaml
    }
  }

  // masters
  const mastersBasePath = path.join(basePath, 'masters')
  for (const masterName of fs.readdirSync(mastersBasePath)) {
    const rawYaml = fs.readFileSync(
      path.join(mastersBasePath, masterName),
      'utf8'
    )
    examples.masters[getBaseName(masterName)] = rawYaml
  }

  return examples
}
