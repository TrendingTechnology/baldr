// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'
import glob from 'glob'

// Project packages.
import { formatMultiPartAssetFileName, getExtension } from '@bldr/core-browser'
import { writeMetaDataYaml, operations } from '@bldr/media-manager'

interface CmdObj {
  dryRun: boolean
}

/**
 * Rename multipart assets. Example “b mp "*.jpg" Systeme”
 *
 * @param globPattern - For example `*.jpg`
 * @param prefix - For example `Systeme`
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (globPattern: string, prefix: string, cmdObj: CmdObj): Promise<void> {
  const files = glob.sync(globPattern)
  if (files.length < 1) {
    console.log('Glob matches no files.')
    return
  }
  files.sort(undefined)

  let no = 1
  const extension = getExtension(files[0])
  if (extension == null) throw Error('No extension')
  const firstNewFileName = `${prefix}.${extension}`
  for (const oldFileName of files) {
    // Omit already existent info file by the renaming.
    if (oldFileName.match(/yml$/i) == null) {
      const newFileName = formatMultiPartAssetFileName(`${prefix}.${extension}`, no)
      console.log(`${chalk.yellow(oldFileName)} -> ${chalk.green(newFileName)}`)
      if (!cmdObj.dryRun) fs.renameSync(oldFileName, newFileName)
      no += 1
    }
  }

  if (fs.existsSync(firstNewFileName) && !cmdObj.dryRun) {
    writeMetaDataYaml(firstNewFileName)
    await operations.normalizeMediaAsset(firstNewFileName, { wikidata: false })
  }
}

module.exports = action
