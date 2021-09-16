// Node packages.

import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'
import * as log from '@bldr/log'

function findPackageJson (filePath: string): string | undefined {
  let parentDir: string
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
    parentDir = filePath
  } else {
    parentDir = path.dirname(filePath)
  }
  const segments = parentDir.split(path.sep)
  for (let index = segments.length; index >= 0; index--) {
    const pathSegments = segments.slice(0, index)
    const packageJson = [...pathSegments, 'package.json'].join(path.sep)
    if (fs.existsSync(packageJson)) {
      return packageJson
    }
  }
}

/**
 * @param filePath - A file inside a javascript / node package.
 */
async function action (scriptName: string, filePath: string): Promise<void> {
  filePath = path.resolve(filePath)
  const packageJson = findPackageJson(path.resolve(filePath))

  if (packageJson == null) {
    log.info('No package.json found on %s.', filePath)
    throw Error('No package.json found.')
  }
  log.info('Found %s', packageJson)

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
        reject(new Error(log.formatWithoutColor('The script % failed', scriptName)))
      }
    })
  })
}

export = action
