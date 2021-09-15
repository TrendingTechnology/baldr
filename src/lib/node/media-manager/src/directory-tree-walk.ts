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
type WalkFunc = (path: string, payload?: object | any) => any

/**
 * A collection of walk functions.
 */
interface WalkFuncBundle {
  /**
   * This function is called on every presentation.
   */
  presentation?: WalkFunc

  /**
   * This function is called on every asset.
   */
  asset?: WalkFunc

  /**
   * This function is called on every TeX file.
   */
  tex?: WalkFunc

  /**
   * This function is called on all media
   * types, at the moment on presentations and assets.
   */
  all?: WalkFunc

  /**
   * This function is called on every file.
   */
  everyFile?: WalkFunc

  /**
   * This function is called on directories.
   */
  directory?: WalkFunc
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
}

/**
 * Execute a function on one file or walk trough all files matching a
 * regex in the current working directory or in the given directory
 * path.
 *
 * @param func - A single function or an object containing functions.
 */
export async function walk (
  func: WalkFunc | WalkFuncBundle,
  opt?: WalkOption
): Promise<void> {
  // Some checks to exit early.
  if (func == null) {
    throw new Error('Missing property: `func`.')
  }
  if (typeof opt !== 'object') {
    opt = {}
  }
  if (typeof func === 'object' && opt.regex != null) {
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
      await walk(func, {
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
    if (typeof func !== 'function' && func.directory != null) {
      await func.directory(opt.path, opt.payload)
    }
    if (fs.existsSync(opt.path)) {
      const files = fs.readdirSync(opt.path)
      for (const fileName of files) {
        // Exclude hidden files and directories like '.git'
        if (fileName.charAt(0) !== '.') {
          const relPath = path.join(opt.path, fileName)
          await walk(func, {
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

    if (typeof func === 'function') {
      await func(opt.path, opt.payload)
      return
    }
    if (func.everyFile != null) {
      await func.everyFile(opt.path, opt.payload)
    }
    const isPresentation = media.isPresentation(opt.path)
    const isAsset = media.isAsset(opt.path)
    const isTex = media.isTex(opt.path)

    if ((isPresentation || isAsset || isTex) && func.all != null) {
      await func.all(opt.path, opt.payload)
    }
    if (isPresentation && func.presentation != null) {
      await func.presentation(opt.path, opt.payload)
    } else if (isAsset && func.asset != null) {
      await func.asset(opt.path, opt.payload)
    } else if (isTex && func.tex != null) {
      await func.tex(opt.path, opt.payload)
    }
  }
}
