/**
 * Open files and path in the shell, the file manager etc (using child_process.spawn)
 *
 * @module @bldr/open-with
 */

import childProcess from 'child_process'
import fs from 'fs'

// Project packages.
import { getConfig } from '@bldr/config'
import path from 'path'

const config = getConfig()

/**
 * Open a file path with an executable.
 *
 * To launch apps via the REST API the systemd unit file must run as
 * the user you logged in to your desktop environment. You also have to set
 * to environment variables: `DISPLAY=:0` and
 * `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$UID/bus`
 *
 * ```
 * Environment=DISPLAY=:0
 * Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
 * User=1000
 * Group=1000
 * ```
 *
 * @param executable - Name or path of an executable.
 * @param filePath - The path of a file or a folder.
 *
 * @see node module on npmjs.org “open”
 * @see {@link https://unix.stackexchange.com/a/537848}
 */
export function openWith (
  executable: string,
  filePath: string
): childProcess.ChildProcess {
  // See node module on npmjs.org “open”
  const subprocess = childProcess.spawn(executable, [filePath], {
    stdio: 'ignore',
    detached: true
  })
  subprocess.unref()
  return subprocess
}

interface OpenInFileManagerResult {
  fileManager: string
  filePath: string
  parentDir: string
  process?: childProcess.ChildProcess
  opened: boolean
  createdParentDir: boolean
}

/**
 * Open one file path with the in `config.mediaServer.fileManager`
 * specified file manager.
 *
 * @param filePath - The file path that should be opened in the file manager.
 * @param createParentDir - Create the directory structure of the given
 *   `filePath` in a recursive manner.
 */
function openSinglePathInFileManager (
  filePath: string,
  createParentDir: boolean = false
): OpenInFileManagerResult {
  let createdParentDir = false
  let opened = false
  let process
  if (createParentDir && !fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true })
    createdParentDir = true
  }
  const stat = fs.statSync(filePath)
  const parentDir = stat.isDirectory() ? filePath : path.dirname(filePath)

  if (fs.existsSync(parentDir)) {
    // xdg-open opens a mounted root folder in vs code.
    process = openWith(config.mediaServer.fileManager, parentDir)
    opened = true
  }
  return {
    fileManager: config.mediaServer.fileManager,
    filePath,
    parentDir,
    opened,
    createdParentDir,
    process
  }
}

/**
 * Open a file path or multiple file paths with the in
 * `config.mediaServer.fileManager` specified file manager.
 *
 * @param filePaths - The file paths that should be opened in the file manager.
 * @param createParentDir - Create the directory structure of the given
 *   `filePath` in a recursive manner.
 */
export function openInFileManager (
  filePaths: string | string[],
  createParentDir: boolean = false
): OpenInFileManagerResult[] {
  const results = []
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths]
  }
  for (const filePath of filePaths) {
    results.push(openSinglePathInFileManager(filePath, createParentDir))
  }
  return results
}
