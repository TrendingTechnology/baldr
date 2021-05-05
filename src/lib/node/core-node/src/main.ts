/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */

// Node packages.
import childProcess from 'child_process'
import fs from 'fs'
import os from 'os'
import util from 'util'
import path from 'path'
import { URL } from 'url'

// Third party packages.
import git from 'git-rev-sync'
import fetch from 'node-fetch'

/**
 * A wrapper function around the functions `util.format()` and `console.log()`.
 *
 * ```js
 * util.format('%s:%s', 'foo', 'bar');
 * ```
 */
export function log (format: string, ...args: any): void {
  console.log(util.format(format, ...args))
}

interface GitHead {
  short: string
  long: string
  isDirty: boolean
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
    const process = childProcess.spawnSync('which', [executable], { shell: true })
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
  if (!fs.existsSync(filePath)) throw new Error(`PDF file doesn’t exist: ${filePath}.`)
  const proc = childProcess.spawnSync(
    'pdfinfo', [filePath],
    { encoding: 'utf-8', cwd: process.cwd() }
  )
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
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
export function readFile (filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`The file “${filePath}” cannot be read because it does not exist.`)
  }
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
export function writeFile (filePath: string, content: string): void {
  fs.writeFileSync(filePath, content)
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
