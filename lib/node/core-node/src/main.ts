/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */

import childProcess from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { URL } from 'url'

import git from 'git-rev-sync'
import fetch from 'node-fetch'

interface GitHead {
  short: string
  long: string
  isDirty: boolean
}

/**
 * ```js
 * const __filename = getFilename()
 * ```
 */
export function getFilename (): string {
  return new URL('', import.meta.url).pathname
}

/**
 * ```js
 * const new URL('.', import.meta.url).pathname = getDirname()
 * ```
 */
export function getDirname (): string {
  return new URL('.', import.meta.url).pathname
}

/**
 * Generate a revision string in the form version-gitshort(-dirty)
 */
export function gitHead (): GitHead {
  return {
    short: git.short(),
    long: git.long(),
    isDirty: git.isDirty()
  }
}

/**
 * Check if some executables are installed. Throws an error if not.
 *
 * @param executables - An array of executables names or a
 *   a single executable as a string.
 */
export function checkExecutables (executables: string | string[]): void {
  if (!Array.isArray(executables)) executables = [executables]
  for (const executable of executables) {
    const process = childProcess.spawnSync('which', [executable], {
      shell: true
    })
    if (process.status !== 0) {
      throw new Error(`Executable is not available: ${executable}`)
    }
  }
}

/**
 * Get the page count of an PDF file. You have to install the command
 * line utility `pdfinfo` from the Poppler PDF suite.
 *
 * @see {@link https://poppler.freedesktop.org}
 *
 * @param filePath - The path on an PDF file.
 */
export function getPdfPageCount (filePath: string): number {
  checkExecutables('pdfinfo')
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file doesn’t exist: ${filePath}.`)
  }
  const proc = childProcess.spawnSync('pdfinfo', [filePath], {
    encoding: 'utf-8',
    cwd: process.cwd()
  })
  const match = proc.stdout.match(/Pages:\s+(\d+)/)
  if (match != null) {
    return parseInt(match[1])
  }
  return 0
}

/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
export async function fetchFile (url: string, dest: string): Promise<void> {
  const response = await fetch(new URL(url))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
}

/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
export function untildify (filePath: string): string {
  if (filePath[0] === '~') {
    return path.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}

/**
 * Find a specific file by file name in a parent folder structure
 *
 * @param filePath - A file path to search for a file in one of the parent
 *   folder struture.
 * @param fileName - The name of the searched file.
 *
 * @returns The path of the found parent file or undefined if not found.
 */
export function findParentFile (
  filePath: string,
  fileName: string
): string | undefined {
  let parentDir: string
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
    parentDir = filePath
  } else {
    parentDir = path.dirname(filePath)
  }
  const segments = parentDir.split(path.sep)
  for (let index = segments.length; index >= 0; index--) {
    const pathSegments = segments.slice(0, index)
    const parentFile = [...pathSegments, fileName].join(path.sep)
    if (fs.existsSync(parentFile)) {
      return parentFile
    }
  }
}

/**
 * Extract the base name without the extension from a file path.
 *
 * @param filePath A file path.
 *
 * @returns The base name without the extension.
 */
export function getBasename (filePath: string): string {
  return path.basename(filePath, path.extname(filePath))
}

/**
 * Create a path like `/tmp/baldr-`. The path does not exist yet. It has
 * to be created.
 *
 * @returns A file path in the temporary OS directory containing `baldr`.
 */
export function getTmpDirPath (): string {
  return path.join(os.tmpdir(), path.sep, 'baldr-')
}

/**
 * Create a temporary directory.
 *
 * @returns The path of the created temporary directory.
 */
export function createTmpDir (): string {
  return fs.mkdtempSync(getTmpDirPath())
}

/**
 * Copy a file to the temporary directory of the operation system.
 *
 * @param pathSegments - Path segments for `path.join()`.
 *
 * @returns The destination path in the temporary directory of the OS.
 */
export function copyToTmp (...pathSegments: string[]): string {
  const src = path.join(...pathSegments)
  const tmpDir = createTmpDir()
  const basename = path.basename(src)
  const dest = path.join(tmpDir, basename)
  fs.copyFileSync(src, dest)
  return dest
}
