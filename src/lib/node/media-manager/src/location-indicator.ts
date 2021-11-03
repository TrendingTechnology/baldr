/**
 * @module @bldr/media-manager/location-indicator
 */

// Node packages.
import path from 'path'
import fs from 'fs'

// Project packages.

import { untildify, findParentFile } from '@bldr/core-node'
import { getConfig } from '@bldr/config-ng'

const config = getConfig()

/**
 * Indicates in which folder structure a file is located.
 *
 * Merge the configurations entries of `config.mediaServer.basePath` and
 * `config.mediaServer.archivePaths`. Store only the accessible ones.
 */
class LocationIndicator {
  /**
   * The base path of the main media folder.
   */
  public main: string

  /**
   * Multiple base paths of media collections (the main base path and some
   * archive base paths)
   */
  public readonly basePaths: string[]

  constructor () {
    this.main = config.mediaServer.basePath
    const basePaths = [
      config.mediaServer.basePath,
      ...config.mediaServer.archivePaths
    ]

    this.basePaths = []
    for (let i = 0; i < basePaths.length; i++) {
      basePaths[i] = path.resolve(untildify(basePaths[i]))
      if (fs.existsSync(basePaths[i])) {
        this.basePaths.push(basePaths[i])
      }
    }
  }

  /**
   * Check if the `currentPath` is inside a archive folder structure and
   * not in den main media folder.
   */
  isInArchive (currentPath: string): boolean {
    if (path.resolve(currentPath).includes(this.main)) {
      return false
    }
    return true
  }

  /**
   * A deactivated directory is a directory which has no direct counter part in
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
    if (relPath == null) {
      return true
    }
    const segments = relPath.split(path.sep)
    for (const segment of segments) {
      if (segment.match(/^\d\d/) == null) {
        return true
      }
    }
    return false
  }

  /**
   * Get the parent directory in which a presentation file
   * (Praesentation.baldr.yml) is located. For example: Assuming this file
   * exists: `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Presentation.baldr.yml`
   *
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
   */
  public getPresParentDir (currentPath: string): string | undefined {
    const parentFile = findParentFile(currentPath, 'Praesentation.baldr.yml')
    if (parentFile != null) {
      return path.dirname(parentFile)
    }
  }

  /**
   * Get the first parent directory (the first folder with a prefix like `10_`)
   * that has a two-digit numeric prefix.
   *
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
   * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
   */
  public getTwoDigitPrefixedParentDir (
    currentPath: string
  ): string | undefined {
    let parentDir: string
    if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()) {
      parentDir = currentPath
    } else {
      parentDir = path.dirname(currentPath)
    }
    const segments = parentDir.split(path.sep)
    for (let index = segments.length - 1; index >= 0; index--) {
      const segment = segments[index]
      if (segment.match(/^\d\d_.+/) != null) {
        // end not included
        const pathSegments = segments.slice(0, index + 1)
        return pathSegments.join(path.sep)
      }
    }
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
    if (presPath == null) {
      throw new Error('The parent presentation folder couldn’t be detected!')
    }
    return path.join(presPath, subDir, fileName)
  }

  /**
   * Get the path relative to one of the base paths and `currentPath`.
   *
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */
  getRelPath (currentPath: string): string | undefined {
    currentPath = path.resolve(currentPath)
    let relPath: string | undefined
    for (const basePath of this.basePaths) {
      if (currentPath.indexOf(basePath) === 0) {
        relPath = currentPath.replace(basePath, '')
        break
      }
    }
    if (relPath !== undefined) {
      return relPath.replace(new RegExp(`^${path.sep}`), '')
    }
  }

  /**
   * Get the base path. If the base path and the relative path are combined,
   * the absolute path is created.
   *
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */
  getBasePath (currentPath: string): string | undefined {
    currentPath = path.resolve(currentPath)
    let basePath: string | undefined
    for (const bPath of this.basePaths) {
      if (currentPath.indexOf(bPath) === 0) {
        basePath = bPath
        break
      }
    }
    if (basePath !== undefined) {
      return basePath.replace(new RegExp(`${path.sep}$`), '')
    }
  }

  /**
   * Create for each path segment of the relative path a reference (ref) string.
   *
   * This path
   *
   * `/var/data/baldr/media/12/10_Interpreten/20_Auffuehrungspraxis/20_Instrumentenbau/TX`
   *
   * is converted into
   *
   * ```js
   * ['12', 'Interpreten', 'Auffuehrungspraxis', 'Instrumentenbau', 'TX']
   * ```
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */

  getRefOfSegments (currentPath: string): string[] | undefined {
    currentPath = path.resolve(currentPath)
    const relPath = this.getRelPath(path.dirname(currentPath))
    if (relPath == null) {
      return
    }
    const segments = relPath.split(path.sep)
    const result: string[] = []
    for (const segment of segments) {
      result.push(segment.replace(/\d{2,}_/, ''))
    }
    return result
  }

  /**
   * The mirrored path of the current give file path, for example:
   *
   * This folder in the main media folder structure
   *
   * `/var/data/baldr/media/12/10_Interpreten/20_Auffuehrungspraxis/20_Instrumentenbau/TX`
   *
   * gets converted to
   *
   * `/mnt/xpsschulearchiv/12/10_Interpreten/20_Auffuehrungspraxis/20_Instrumentenbau`.
   *
   * @param currentPath - The path of a file or a directory inside
   *   a media server folder structure or inside its archive folders.
   */
  getMirroredPath (currentPath: string): string | undefined {
    const basePath = this.getBasePath(currentPath)
    const relPath = this.getRelPath(currentPath)
    let mirroredBasePath: string | undefined
    for (const bPath of this.basePaths) {
      if (basePath !== bPath) {
        mirroredBasePath = bPath
        break
      }
    }
    if (mirroredBasePath !== undefined && relPath !== undefined) {
      return path.join(mirroredBasePath, relPath)
    }
  }
}

export const locationIndicator = new LocationIndicator()

export default locationIndicator
