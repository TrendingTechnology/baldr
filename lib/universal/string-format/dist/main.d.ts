export { asciify, deasciify, referencify } from './ascii';
export { formatToYear, getCurrentSchoolYear, getFormatedSchoolYear, formatToLocalDate, formatToLocalDateTime, convertHHMMSSToSeconds, convertSecondsToHHMMSS } from './date';
export { formatMultiPartAssetFileName, getExtension } from './file-path';
export { shortenText, convertHtmlToPlainText, capitalize } from './format';
export { formatImslpUrl, formatMusicbrainzRecordingUrl, formatMusicbrainzWorkUrl, formatMusescoreUrl, formatWikicommonsUrl, formatWikidataUrl, formatWikipediaUrl, formatYoutubeUrl } from './url';
/**
 * @see https://stackoverflow.com/a/8809472/10193818
 */
export declare function generateUUID(): string;
