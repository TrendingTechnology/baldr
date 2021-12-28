/**
 * Code which can shared in all parts of the app.
 *
 * @module @bldr/lamp/lib
 */

import { showMessage } from '@bldr/notification'

/**
 * Check if the input is a valid URI. Prefix with `ref:` if necessary.
 *
 * @param {String} uri -  The URI to validate.
 *
 * @returns {ExecFileSyncOptionsWithStringEncoding}
 */
export function validateUri (uri: string) {
  if (typeof uri !== 'string') throw new Error(`”${uri}“ is not a string.`)
  const segments = uri.split(':')
  // To allow URI with out a URI scheme. This defaults to `id`.
  if (segments.length === 1) {
    uri = `ref:${uri}`
  }
  return uri
}
