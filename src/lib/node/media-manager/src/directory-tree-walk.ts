/**
 * Walk through a tree of files and directories.
 *
 * @module @bldr/media-manager/directory-tree-walk
 */

import fs from 'fs'
import path from 'path'

import * as media from './media-file-classes'

/**
 * A function which is called during the directory structure walk.
 */
type WalkFunction = (path: string, payload?: object | any) => any

/**
 * A collection of walk functions.
 */
interface WalkFunctionBundle {
  /**
   * This function is called on every presentation.
   */
  presentation?: WalkFunction

  /**
   * This function is called on every asset.
   */
  asset?: WalkFunction

  /**
   * This function is called on every TeX file.
   */
  tex?: WalkFunction

  /**
   * This function is called on all media
   * types, at the moment on presentations and assets.
   */
  all?: WalkFunction

  /**
   * This function is called on every file.
   */
  everyFile?: WalkFunction

  /**
   * This function is called on directories.
   */
  directory?: WalkFunction
}

/**
 * A collection of options for the walk function.
 */
interface WalkOption {
  /**
   * The function/s is/are called with with this payload. Multiple
   * arguments have to be bundled as a single object.
   */
  payload?: any

  /**
   * An array of directory or file paths or a single path. If this
   * property is not set, the current working directory is used.
   */
  path?: string | string[]

  /**
   * If this property is set, `func` have to be a single function. Each
   * resolved file path must match this regular expression to execute
   * the function. If you have specified a string, this string is
   * converted into the regular expression `*.ext`.
   */
  regex?: string | RegExp

  extension?: string

  /**
   * Descend at most levels (a non-negative integer) levels of directories
   * below the starting-pointq.
   */
  maxDepths?: number
}

interface WalkOptionNormalized {
  payload?: any
  regex?: RegExp
}

async function callWalkFunctionBundle (
  bundle: WalkFunctionBundle,
  filePath: string,
  payload?: any
): Promise<void> {
  if (bundle.everyFile != null) {
    await bundle.everyFile(filePath, payload)
  }
  const isPresentation = media.isPresentation(filePath)
  const isAsset = media.isAsset(filePath)
  const isTex = media.isTex(filePath)

  if ((isPresentation || isAsset || isTex) && bundle.all != null) {
    await bundle.all(filePath, payload)
  }
  if (isPresentation && bundle.presentation != null) {
    await bundle.presentation(filePath, payload)
  } else if (isAsset && bundle.asset != null) {
    await bundle.asset(filePath, payload)
  } else if (isTex && bundle.tex != null) {
    await bundle.tex(filePath, payload)
  }
}
function normalizeOptions (raw: WalkOption): WalkOptionNormalized {
  const normalized = {} as WalkOptionNormalized
  // If regex is a string it is treated as an extension.
  let extension: string | undefined

  if (typeof raw.regex === 'string' && raw.extension != null) {
    throw new Error(
      'The options “extension” and “regex” are mutually exclusive.'
    )
  }

  if (typeof raw.regex === 'string') {
    extension = raw.regex
  } else if (raw.extension != null) {
    extension = raw.extension
  }

  if (extension != null) {
    normalized.regex = new RegExp('.*.' + extension + '$', 'i') // eslint-disable-line
  }

  if (raw.payload != null) {
    normalized.payload = raw.payload
  }
  return normalized
}

async function walkRecursively (
  walkFunction: WalkFunction | WalkFunctionBundle,
  filePaths: string | string[],
  opt: WalkOptionNormalized
): Promise<void> {
  // A list of file paths.
  if (Array.isArray(filePaths)) {
    for (const relPath of filePaths) {
      await walkRecursively(walkFunction, relPath, opt)
    }
    return
  }

  // Rename action: Rename during walk, filePaths can change
  if (!fs.existsSync(filePaths)) {
    return
  }

  // A directory.
  if (fs.statSync(filePaths).isDirectory()) {
    if (typeof walkFunction !== 'function' && walkFunction.directory != null) {
      await walkFunction.directory(filePaths, opt.payload)
    }
    if (fs.existsSync(filePaths)) {
      const files = fs.readdirSync(filePaths)
      for (const fileName of files) {
        // Exclude hidden files and directories like '.git'
        if (fileName.charAt(0) !== '.') {
          const relPath = path.join(filePaths, fileName)
          await walkRecursively(walkFunction, relPath, opt)
        }
      }
    }

    // A single file.
  } else {
    // Exclude hidden files and directories like '.git'
    if (path.basename(filePaths).charAt(0) === '.') {
      return
    }
    if (!fs.existsSync(filePaths)) {
      return
    }
    if (opt.regex != null) {
      if (filePaths.match(opt.regex) == null) {
        return
      }
    }

    if (typeof walkFunction === 'function') {
      await walkFunction(filePaths, opt.payload)
      return
    }
    await callWalkFunctionBundle(walkFunction, filePaths, opt.payload)
  }
}

/**
 * Execute a function on one file or walk trough all files matching a
 * regex in the current working directory or in the given directory
 * path.
 *
 * @param walkFunction - A single function or an object containing functions.
 */
export async function walk (
  walkFunction: WalkFunction | WalkFunctionBundle,
  opt?: WalkOption
): Promise<void> {
  // Some checks to exit early.
  if (typeof opt !== 'object') {
    opt = {}
  }
  if (typeof walkFunction === 'object' && opt.regex != null) {
    throw new Error(
      'Use a single function and a regex or an object containing functions without a regex.'
    )
  }

  // commander [filepath...] -> without arguments is an empty array.
  if (opt.path == null || (Array.isArray(opt.path) && opt.path.length === 0)) {
    opt.path = process.cwd()
  }

  // A list of file paths.
  if (Array.isArray(opt.path)) {
    for (const relPath of opt.path) {
      await walk(walkFunction, {
        path: relPath,
        payload: opt.payload,
        regex: opt.regex
      })
    }
    return
  }

  // Rename action: Rename during walk, opt.path can change
  if (!fs.existsSync(opt.path)) {
    return
  }

  // A directory.
  if (fs.statSync(opt.path).isDirectory()) {
    if (typeof walkFunction !== 'function' && walkFunction.directory != null) {
      await walkFunction.directory(opt.path, opt.payload)
    }
    if (fs.existsSync(opt.path)) {
      const files = fs.readdirSync(opt.path)
      for (const fileName of files) {
        // Exclude hidden files and directories like '.git'
        if (fileName.charAt(0) !== '.') {
          const relPath = path.join(opt.path, fileName)
          await walk(walkFunction, {
            path: relPath,
            payload: opt.payload,
            regex: opt.regex
          })
        }
      }
    }

    // A single file.
  } else {
    // Exclude hidden files and directories like '.git'
    if (path.basename(opt.path).charAt(0) === '.') {
      return
    }
    if (!fs.existsSync(opt.path)) {
      return
    }
    if (opt.regex != null) {
      // If regex is a string it is treated as an extension.
      if (typeof opt.regex === 'string') {
        opt.regex = new RegExp('.*.' + opt.regex + '$', 'i') // eslint-disable-line
      }
      if (opt.path.match(opt.regex) == null) {
        return
      }
    }

    if (typeof walkFunction === 'function') {
      await walkFunction(opt.path, opt.payload)
      return
    }
    await callWalkFunctionBundle(walkFunction, opt.path, opt.payload)
  }
}
