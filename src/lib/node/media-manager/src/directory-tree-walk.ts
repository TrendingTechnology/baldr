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
  maxDepths?: number
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
function normalizeOptions (raw?: WalkOption): WalkOptionNormalized {
  const normalized: WalkOptionNormalized = {}
  // If regex is a string it is treated as an extension.
  let extension: string | undefined

  if (typeof raw?.regex === 'string' && raw.extension != null) {
    throw new Error(
      'The options “extension” and “regex” are mutually exclusive.'
    )
  }

  if (typeof raw?.regex === 'string') {
    extension = raw.regex
  } else if (raw?.extension != null) {
    extension = raw.extension
  }

  if (extension != null) {
    normalized.regex = new RegExp('.*.' + extension + '$', 'i') // eslint-disable-line
  }

  if (raw?.regex != null && typeof raw.regex !== 'string') {
    normalized.regex = raw.regex
  }

  normalized.maxDepths = raw?.maxDepths

  if (raw?.payload != null) {
    normalized.payload = raw.payload
  }
  return normalized
}

async function walkRecursively (
  walkFunction: WalkFunction | WalkFunctionBundle,
  filePaths: string | string[],
  opt: WalkOptionNormalized,
  depths: number = 0
): Promise<void> {
  if (opt.maxDepths != null && opt.maxDepths + 1 < depths) {
    return
  }
  // A list of file paths.
  if (Array.isArray(filePaths)) {
    for (const filePath of filePaths) {
      await walkRecursively(walkFunction, filePath, opt)
    }
    return
  }

  const filePath: string = filePaths

  // Rename action: Rename during walk, filePath can change
  if (!fs.existsSync(filePath)) {
    return
  }

  // A directory.
  if (fs.statSync(filePath).isDirectory()) {
    const directoryPath: string = filePath
    if (typeof walkFunction !== 'function' && walkFunction.directory != null) {
      await walkFunction.directory(directoryPath, opt.payload)
    }
    if (fs.existsSync(directoryPath)) {
      const files = fs.readdirSync(directoryPath)
      depths++
      for (const fileName of files) {
        // Exclude hidden files and directories like '.git'
        if (fileName.charAt(0) !== '.') {
          await walkRecursively(
            walkFunction,
            path.join(directoryPath, fileName),
            opt,
            depths
          )
        }
      }
    }

    // A single file.
  } else {
    // Exclude hidden files and directories like '.git'
    if (path.basename(filePath).charAt(0) === '.') {
      return
    }
    if (!fs.existsSync(filePath)) {
      return
    }
    if (opt.regex != null) {
      if (filePath.match(opt.regex) == null) {
        return
      }
    }

    if (typeof walkFunction === 'function') {
      await walkFunction(filePath, opt.payload)
      return
    }
    await callWalkFunctionBundle(walkFunction, filePath, opt.payload)
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
  if (typeof walkFunction === 'object' && opt?.regex != null) {
    throw new Error(
      'Use a single function and a regex or an object containing functions without a regex.'
    )
  }

  let filePaths: string | string[]

  // commander [filepath...] -> without arguments is an empty array.
  if (
    opt?.path == null ||
    (Array.isArray(opt?.path) && opt?.path.length === 0)
  ) {
    filePaths = process.cwd()
  } else {
    filePaths = opt.path
  }

  await walkRecursively(walkFunction, filePaths, normalizeOptions(opt))
}
