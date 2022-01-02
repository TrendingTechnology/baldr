"use strict";
/**
 * Format some HTTP URLs for various external sites.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatYoutubeUrl = exports.formatWikipediaUrl = exports.formatWikidataUrl = exports.formatWikicommonsUrl = exports.formatMusescoreUrl = exports.formatMusicbrainzWorkUrl = exports.formatMusicbrainzRecordingUrl = exports.formatImslpUrl = void 0;
/**
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @returns For example: `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
function formatImslpUrl(id) {
    return `https://imslp.org/wiki/${id}`;
}
exports.formatImslpUrl = formatImslpUrl;
/**
 * Format a Musicbrainz recording URL.
 *
 * @param recordingId - A UUID.
 *
 * @returns For example: `https://musicbrainz.org/recording/${RecordingId}`
 */
function formatMusicbrainzRecordingUrl(recordingId) {
    return `https://musicbrainz.org/recording/${recordingId}`;
}
exports.formatMusicbrainzRecordingUrl = formatMusicbrainzRecordingUrl;
/**
 * Format a Musicbrainz work URL.
 *
 * @param workId - A UUID.
 *
 * @returns For example: `https://musicbrainz.org/work/${WorkId}`
 */
function formatMusicbrainzWorkUrl(workId) {
    return `https://musicbrainz.org/work/${workId}`;
}
exports.formatMusicbrainzWorkUrl = formatMusicbrainzWorkUrl;
/**
 * Format a Musescore URL.
 *
 * @param The score ID.
 *
 * @returns For example: For example: `https://musescore.com/score/1234`
 */
function formatMusescoreUrl(id) {
    if (typeof id === 'number') {
        id = id.toString();
    }
    return `https://musescore.com/score/${id}`;
}
exports.formatMusescoreUrl = formatMusescoreUrl;
/**
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @returns For example: `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
function formatWikicommonsUrl(fileName) {
    return `https://commons.wikimedia.org/wiki/File:${fileName}`;
}
exports.formatWikicommonsUrl = formatWikicommonsUrl;
/**
 * Format a Wikidata URL.
 *
 * @param id - The wikidata id. (Should start with `Q`).
 *
 * @returns For example: `https://www.wikidata.org/wiki/Q42`
 */
function formatWikidataUrl(id) {
    id = String(id);
    const idNumber = parseInt(id.replace(/^Q/, ''));
    // https://www.wikidata.org/wiki/Q42
    return `https://www.wikidata.org/wiki/Q${idNumber}`;
}
exports.formatWikidataUrl = formatWikidataUrl;
/**
 * Format a Wikipedia URL.
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 *
 * @returns For example: `https://en.wikipedia.org/wiki/A_Article`
 */
function formatWikipediaUrl(nameSpace) {
    // https://de.wikipedia.org/wiki/Gesch%C3%BCtztes_Leerzeichen
    // https://en.wikipedia.org/wiki/Non-breaking_space
    const segments = nameSpace.split(':');
    const lang = segments[0];
    const slug = encodeURIComponent(segments[1]);
    return `https://${lang}.wikipedia.org/wiki/${slug}`;
}
exports.formatWikipediaUrl = formatWikipediaUrl;
/**
 * Format a YouTube URL.
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 *
 * @returns For example: `https://youtu.be/CQYypFMTQcE`
 */
function formatYoutubeUrl(id) {
    return `https://youtu.be/${id}`;
}
exports.formatYoutubeUrl = formatYoutubeUrl;
