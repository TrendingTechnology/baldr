// Node packages.
import fs from 'fs'

// Project packages.
import { operations, walk, locationIndicator } from '@bldr/media-manager'
import { convertFromYamlRaw } from '@bldr/yaml'
import { GenericError } from '@bldr/type-definitions'
import { getExtension } from '@bldr/core-browser'
import * as log from '@bldr/log'

function validateYamlOneFile (filePath: string): void {
  try {
    convertFromYamlRaw(fs.readFileSync(filePath, 'utf8'))
    log.debug('Valid YAML file: %s', filePath)
  } catch (error) {
    const e = error as GenericError
    log.error(
      'Invalid YAML file %s. Error: %s: %s',
      filePath,
      e.name,
      e.message
    )
    throw new Error(e.name)
  }
}

interface CmdObj {
  wikidata: boolean
  parentPresDir: boolean
}

/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[], cmdObj: CmdObj): Promise<void> {
  if (filePaths.length === 0) {
    filePaths = [process.cwd()]
  }
  if (cmdObj.parentPresDir) {
    const presParentDir = locationIndicator.getPresParentDir(filePaths[0])
    if (presParentDir != null) {
      log.info(
        'Run the normalization task on the parent presentation folder: %s',
        presParentDir
      )
      filePaths = [presParentDir]
    }
  }

  // `baldr normalize video.mp4.yml` only validates the YAML structure. We have
  // to call `baldr normalize video.mp4` to get the full normalization of the
  // metadata file video.mp4.yml.
  if (
    filePaths.length === 1 &&
    filePaths[0].match(/\.yml$/) != null &&
    filePaths[0].match(/\.baldr\.yml$/) == null
  ) {
    filePaths[0] = filePaths[0].replace(/\.yml$/, '')
  }
  await walk(
    {
      async asset (filePath) {
        if (!fs.existsSync(`${filePath}.yml`)) {
          await operations.initializeMetaYaml(filePath)
        } else {
          await operations.normalizeMediaAsset(filePath, cmdObj)
        }
        operations.renameByRef(filePath)
      },
      everyFile (filePath) {
        const extension = getExtension(filePath)?.toLowerCase()
        if (extension != null && ['tex', 'yml', 'txt'].includes(extension)) {
          operations.fixTypography(filePath)
        }
        if (filePath.match(/\.yml$/i) != null) {
          validateYamlOneFile(filePath)
        } else if (filePath.match(/\.svg$/i) != null) {
          operations.removeWidthHeightInSvg(filePath)
        }
      },
      presentation (filePath) {
        operations.normalizePresentationFile(filePath)
      },
      tex (filePath) {
        log.info('\nPatch the titles of the TeX file “%s”', filePath)
        operations.patchTexTitles(filePath)
      }
    },
    {
      path: filePaths
    }
  )
}

export = action
