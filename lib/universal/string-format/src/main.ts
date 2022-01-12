export { asciify, deasciify, referencify } from './ascii'

export {
  formatToYear,
  getCurrentSchoolYear,
  getFormatedSchoolYear,
  formatToLocalDate,
  formatToLocalDateTime,
  convertHHMMSSToSeconds,
  convertSecondsToHHMMSS
} from './date'

export { formatMultiPartAssetFileName, getExtension } from './file-path'

export { shortenText, convertHtmlToPlainText, capitalize } from './format'

export {
  formatImslpUrl,
  formatMusicbrainzRecordingUrl,
  formatMusicbrainzWorkUrl,
  formatMusescoreUrl,
  formatWikicommonsUrl,
  formatWikidataUrl,
  formatWikipediaUrl,
  formatYoutubeUrl
} from './url'

/**
 * @see https://stackoverflow.com/a/8809472/10193818
 */
export function generateUUID (): string {
  let d = new Date().getTime()
  let d2 = performance.now() * 1000
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16
    if (d > 0) {
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
  })
}
