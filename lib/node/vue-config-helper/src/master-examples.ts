import path from 'path'
import fs from 'fs'

import { createRequire } from 'module'

const require = createRequire(import.meta.url)

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
      .replace('/dist/main.js', ''),
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
