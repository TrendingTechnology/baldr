// Node packages.

import path from 'path'
import childProcess from 'child_process'

import * as log from '@bldr/log'
import { findParentFile } from '@bldr/core-node'

/**
 * @param filePath - A file inside a javascript / node package.
 */
async function action (scriptName: string, filePath: string): Promise<void> {
  filePath = path.resolve(filePath)
  const packageJson = findParentFile(path.resolve(filePath), 'package.json')

  if (packageJson == null) {
    log.info('No package.json found on %s.', [filePath])
    throw Error('No package.json found.')
  }
  log.info('Found %s', [packageJson])

  return await new Promise(function (resolve, reject) {
    const parentDir = path.dirname(packageJson)
    const npm = childProcess.spawn('npm', ['run', scriptName], {
      cwd: parentDir
    })

    npm.stdout.pipe(process.stdout)
    npm.stderr.pipe(process.stderr)

    npm.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(log.format('The script % failed', [scriptName], 'none')))
      }
    })
  })
}

export = action
