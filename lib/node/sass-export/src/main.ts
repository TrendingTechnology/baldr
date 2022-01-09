import path from 'path'

import sassExport from 'sass-export'

import { getConfig } from '@bldr/config'

const config = getConfig()

const sassVariablesPath = path.join(
  config.localRepo,
  'vue',
  'plugins',
  'themes',
  'src',
  'default-vars.scss'
)

interface SassVariable {
  name: string
  value: string
  mapValue?: SassVariable[]
  compiledValue: string
}

interface SassExport {
  variables: SassVariable[]
}

export default function exportSass (): Record<string, string> {
  const struct = sassExport
    .exporter({
      inputFiles: [sassVariablesPath]
    })
    .getStructured() as SassExport

  const vars: Record<string, string> = {}
  for (const v of struct.variables) {
    if (v.name !== '$colors') {
      vars[v.name] = v.compiledValue
    }
  }
  return vars
}
