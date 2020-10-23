/**
 * @module @bldr/media-manager/location-indicator
 */

import config from '@bldr/config'
import path from 'path'
import fs from 'fs'

import { untildify } from './helper'

/**
 * Indicate where a file is located in the media folder structure.
 *
 * Merge the configurations entries of `config.mediaServer.basePath` and
 * `config.mediaServer.archivePaths`. Store only the accessible ones.
 */
class LocationIndicator {
  public main: string

  private paths: string[]
  constructor () {

    this.main = config.mediaServer.basePath
    const basePaths = [
      config.mediaServer.basePath,
      ...config.mediaServer.archivePaths
    ]

    this.paths = []
    for (let i = 0; i < basePaths.length; i++) {
      basePaths[i] = path.resolve(untildify(basePaths[i]))
      if (fs.existsSync(basePaths[i])) {
        this.paths.push(basePaths[i])
      }
    }
  }

  /**
   * Check if the `currentPath` is inside a archive folder structure and
   * not in den main media folder.
   */
  isInArchive (currentPath: string): boolean {
    if (path.resolve(currentPath).indexOf(this.main) > -1) {
      return false
    }
    return true
  }

  /**
   * Get the directory where a presentation file (Praesentation.baldr.yml) is
   * located in (The first folder with a prefix like `10_`)
   *
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
   */
  getPresParentDir (currentPath: string): string {
    // /Duke-Ellington.jpg
    // /Material
    const regexp = new RegExp(path.sep + '([^' + path.sep + ']+)$')
    let match
    do {
      let isPrefixed
      match = currentPath.match(regexp)
      if (match && match.length > 1) {
        // Return only directories not files like
        // ...HB/Orchester/05_Promenade.mp3
        if (
          // 20_Swing -> true
          // Material -> false
          match[1].match(/\d\d_.*/g) &&
          fs.statSync(currentPath).isDirectory()
        ) {
          isPrefixed = true
        }
        if (!isPrefixed) {
          currentPath = currentPath.replace(regexp, '')
        }
      }
      if (isPrefixed) {
        match = false
      }
    } while (match)

    return currentPath
  }

  /**
   * Move a file path into a directory relative to the current
   * presentation directory.
   *
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/NB/Duke-Ellington.jpg` `BD` ->
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/BD/Duke-Ellington.jpg`
   *
   * @param currentPath - The current path.
   * @param subDir - A relative path.
   */
  moveIntoSubdir (currentPath: string, subDir: string): string {
    const fileName = path.basename(currentPath)
    const presPath = this.getPresParentDir(currentPath)
    return path.join(presPath, subDir, fileName)
  }

  /**
   * A deactivaed directory is a directory which has no direct counter part in
   * the main media folder, which is not mirrored. It is a real archived folder
   * in the archive folder. Activated folders have a prefix like `10_`
   *
   * true:
   *
   * - `/archive/10/10_Jazz/30_Stile/10_New-Orleans-Dixieland/Material/Texte.tex`
   * - `/archive/10/10_Jazz/History-of-Jazz/Inhalt.tex`
   * - `/archive/12/20_Tradition/30_Volksmusik/Bartok/10_Tanzsuite/Gliederung.tex`
   *
   * false:
   *
   * `/archive/10/10_Jazz/20_Vorformen/10_Worksongs-Spirtuals/Arbeitsblatt.tex`
   */
  isInDeactivatedDir (currentPath: string): boolean {
    currentPath = path.dirname(currentPath)
    const relPath = this.getRelPath(currentPath)
    const segments = relPath.split(path.sep)
    for (const segment of segments) {
      if (!segment.match(/^\d\d/)) {
        return true
      }
    }
    return false
  }

  /**
   * @returns An array of directory paths in this order: First the main
   *   base path of the media server, then one ore more archive
   *   directory paths. The paths are checked for existence and resolved
   *   (untildified).
   */
  get (): string[] {
    return this.paths
  }

  /**
   * Get the path relative to one of the base paths and `currentPath`.
   *
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */
  getRelPath (currentPath: string): string {
    currentPath = path.resolve(currentPath)
    let relPath
    for (const basePath of this.paths) {
      if (currentPath.indexOf(basePath) === 0) {
        relPath = currentPath.replace(basePath, '')
        break
      }
    }
    if (relPath) return relPath.replace(new RegExp(`^${path.sep}`), '')
    return ''
  }

  /**
   * Get the path relative to one of the base paths and `currentPath`.
   *
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */
  getBasePath (currentPath: string): string {
    currentPath = path.resolve(currentPath)
    let basePath
    for (const bPath of this.paths) {
      if (currentPath.indexOf(bPath) === 0) {
        basePath = bPath
        break
      }
    }
    if (basePath) return basePath.replace(new RegExp(`${path.sep}$`), '')
    return ''
  }

  /**
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */
  getMirroredPath (currentPath: string): string {
    const basePath = this.getBasePath(currentPath)
    const relPath = this.getRelPath(currentPath)
    let mirroredBasePath
    for (const bPath of this.paths) {
      if (basePath !== bPath) {
        mirroredBasePath = bPath
        break
      }
    }
    if (mirroredBasePath && relPath) return path.join(mirroredBasePath, relPath)
    return ''
  }
}

export default new LocationIndicator()
