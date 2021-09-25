/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import fs from 'fs'
import path from 'path'

import { getExtension } from '@bldr/core-browser'
import { MediaResolverTypes, GenericError } from '@bldr/type-definitions'
import { readYamlFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'

export * from './operations'
export * from './directory-tree-walk'
export * from './location-indicator'
export * from './media-file-classes'
export * from './yaml'

interface MoveAssetConfiguration {
  copy?: boolean
  dryRun?: boolean
}

export function setLogLevel (level: number): void {
  log.setLogLevel(level)
}

/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
export function moveAsset (
  oldPath: string,
  newPath: string,
  opts: MoveAssetConfiguration = {}
): string | undefined {
  function move (
    oldPath: string,
    newPath: string,
    { copy, dryRun }: MoveAssetConfiguration
  ): void {
    if (oldPath === newPath) {
      return
    }
    if (copy != null && copy) {
      if (!(dryRun != null && dryRun)) {
        log.debug('Copy file from %s to %s', oldPath, newPath)
        fs.copyFileSync(oldPath, newPath)
      }
    } else {
      if (!(dryRun != null && dryRun)) {
        //  Error: EXDEV: cross-device link not permitted,
        try {
          log.debug('Move file from %s to %s', oldPath, newPath)
          fs.renameSync(oldPath, newPath)
        } catch (error) {
          const e = error as GenericError
          if (e.code === 'EXDEV') {
            log.debug(
              'Move file by copying and deleting from %s to %s',
              oldPath,
              newPath
            )
            fs.copyFileSync(oldPath, newPath)
            fs.unlinkSync(oldPath)
          }
        }
      }
    }
  }

  function moveCorrespondingFile (
    oldPath: string,
    newPath: string,
    search: RegExp,
    replace: string,
    opts: MoveAssetConfiguration
  ): void {
    oldPath = oldPath.replace(search, replace)
    if (fs.existsSync(oldPath)) {
      newPath = newPath.replace(search, replace)
      move(oldPath, newPath, opts)
    }
  }

  if (newPath != null && oldPath !== newPath) {
    if (!(opts.dryRun != null && opts.dryRun)) {
      fs.mkdirSync(path.dirname(newPath), { recursive: true })
    }

    const extension = getExtension(oldPath)
    if (extension === 'eps') {
      // Dippermouth-Blues.eps
      // Dippermouth-Blues.mscx
      moveCorrespondingFile(oldPath, newPath, /\.eps$/, '.mscx', opts)
      // Dippermouth-Blues-eps-converted-to.pdf
      moveCorrespondingFile(
        oldPath,
        newPath,
        /\.eps$/,
        '-eps-converted-to.pdf',
        opts
      )
    }

    // Beethoven.mp4
    // Beethoven.mp4.yml
    // Beethoven.mp4_preview.jpg
    // Beethoven.mp4_waveform.png
    for (const suffix of ['.yml', '_preview.jpg', '_waveform.png']) {
      if (fs.existsSync(`${oldPath}${suffix}`)) {
        move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts)
      }
    }
    move(oldPath, newPath, opts)
    return newPath
  }
}

/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export function readAssetYaml (
  filePath: string
): MediaResolverTypes.YamlFormat | undefined {
  const extension = getExtension(filePath)
  if (extension !== 'yml') {
    filePath = `${filePath}.yml`
  }
  if (fs.existsSync(filePath)) {
    return readYamlFile(filePath) as MediaResolverTypes.YamlFormat
  }
}
