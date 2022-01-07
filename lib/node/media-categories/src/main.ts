
import path from 'path'

import { MediaUri } from '@bldr/client-media-models'

import { abbreviations } from './two-letter-abbreviations'
export { getTwoLetterRegExp } from './two-letter-abbreviations'

export * as categoriesManagement from './management'
export * from './specs'

export const twoLetterAbbreviations = abbreviations

/**
 * Validate a date string in the format `yyyy-mm-dd`.
 */
export function validateDate (value: string): boolean {
  return (value.match(/\d{4,}-\d{2,}-\d{2,}/) != null)
}

/**
 * Validate a ID string of the Baldr media server.
 */
export function validateMediaId (value: string): boolean {
  return (value.match(MediaUri.regExp) != null)
}

/**
 * Validate UUID string (for the Musicbrainz references).
 */
export function validateUuid (value: string): boolean {
  return (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i) != null)
}

/**
 * Validate a YouTube ID.
 */
export function validateYoutubeId (value: string): boolean {
  // https://webapps.stackexchange.com/a/101153
  return (value.match(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/) != null)
}

/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param filePath - The media asset file path.
 *
 * @returns The ID prefix.
 */
export function generateIdPrefix (filePath: string): string | undefined {
  // We need the absolute path
  filePath = path.resolve(filePath)
  const pathSegments = filePath.split(path.sep)
  // HB
  const parentDir = pathSegments[pathSegments.length - 2]
  // Match asset type abbreviations, like AB, HB, NB
  if (parentDir.length !== 2 || (parentDir.match(/[A-Z]{2,}/) == null)) {
    return
  }
  const mimeTypeAbbreviation = parentDir
  // 20_Strawinsky-Petruschka
  const subParentDir = pathSegments[pathSegments.length - 3]
  // Strawinsky-Petruschka
  const presentationId = subParentDir.replace(/^[0-9]{2,}_/, '')
  // Strawinsky-Petruschka_HB
  const idPrefix = `${presentationId}_${mimeTypeAbbreviation}`
  return idPrefix
}
