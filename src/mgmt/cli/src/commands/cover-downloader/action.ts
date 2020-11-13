// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { loadYaml, walk } from '@bldr/media-manager'
import { fetchFile } from '@bldr/core-node'

/**
 * @param {String} filePath - The media asset file path.
 */
async function downloadCover (filePath: string): Promise<void> {
  const yamlFile = `${filePath}.yml`
  const metaData = loadYaml(yamlFile)
  console.log(metaData)

  if (metaData.coverSource) {
    const previewFile = `${filePath}_preview.jpg`
    fetchFile(metaData.coverSource, previewFile)
  } else {
    console.log(chalk.red('No property “cover_source” found.'))
  }
}

/**
 * @param files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files: string | string[]): void {
  walk({
    async asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        await downloadCover(relPath)
      }
    }
  }, {
    path: files
  })
}

export = action
