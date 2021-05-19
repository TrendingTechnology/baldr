// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { walk } from '@bldr/media-manager'
import { readYamlFile } from '@bldr/file-reader-writer'
import { fetchFile } from '@bldr/core-node'

/**
 * @param {String} filePath - The media asset file path.
 */
async function downloadCover (filePath: string): Promise<void> {
  const yamlFile = `${filePath}.yml`
  const metaData = readYamlFile(yamlFile)
  console.log(metaData)

  if (metaData.coverSource != null) {
    const previewFile = `${filePath}_preview.jpg`
    await fetchFile(metaData.coverSource, previewFile)
  } else {
    console.log(chalk.red('No property “cover_source” found.'))
  }
}

/**
 * @param files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
async function action (files: string | string[]): Promise<void> {
  await walk({
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
