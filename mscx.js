/**
 * @file Process the various *.mscx files to various other file formats
 * (*.pdf, *.eps, *.svg)
 */

'use strict'

const fs = require('fs-extra')
const path = require('path')
const spawn = require('child_process').spawnSync

/**
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
let checkExecutable = function (executable) {
  let exec = spawn(executable, ['--help'])
  if (exec.status === null) {
    return false
  } else {
    return true
  }
}

/**
 * Check if executables are installed.
 * @param {array} executables - Name of the executables.
 */
let checkExecutables = function (executables = []) {
  let status = true
  let unavailable = []
  executables.forEach((exec) => {
    let check = checkExecutable(exec)
    if (!check) {
      status = false
      unavailable.push(exec)
    }
  })
  return { 'status': status, 'unavailable': unavailable }
}

/**
 * Execute git pull if repository exists.
 *
 * To get changed files:
 * git diff-tree --no-commit-id --name-only -r <commit-ish>
 * git diff-tree --no-commit-id --name-only -r babeae91638b55978b99ee5eb49ac2bf361df51e c11e2736edf1c6f6be47eeaa58fa172beedd6e0c
 * git diff-tree --no-commit-id --name-only -r ba03fc103f962f8274b50aade61c99214d26e918 c11e2736edf1c6f6be47eeaa58fa172beedd6e0c
 *
 * Get current commit id:
 * git rev-parse HEAD
 */
let gitPull = function (basePath) {
  if (fs.existsSync(path.join(basePath, '.git'))) {
    return spawn('git', ['pull'], { cwd: basePath })
  } else {
    return false
  }
}

exports.checkExecutables = checkExecutables
exports.gitPull = gitPull
