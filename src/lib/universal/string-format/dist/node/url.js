"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWikicommonsUrl = exports.formatImslpUrl = exports.formatYoutubeUrl = exports.formatMusicbrainzWorkUrl = exports.formatMusicbrainzRecordingUrl = exports.formatWikipediaUrl = exports.formatWikidataUrl = void 0;
/**
 * Format a Wikidata URL.
 * `https://www.wikidata.org/wiki/Q42`
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
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
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
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 *
 * @param recordingId
 */
function formatMusicbrainzRecordingUrl(recordingId) {
    return `https://musicbrainz.org/recording/${recordingId}`;
}
exports.formatMusicbrainzRecordingUrl = formatMusicbrainzRecordingUrl;
/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 *
 * @param workId
 */
function formatMusicbrainzWorkUrl(workId) {
    return `https://musicbrainz.org/work/${workId}`;
}
exports.formatMusicbrainzWorkUrl = formatMusicbrainzWorkUrl;
/**
 * Format a YouTube URL.
 *
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
function formatYoutubeUrl(id) {
    return `https://youtu.be/${id}`;
}
exports.formatYoutubeUrl = formatYoutubeUrl;
/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
function formatImslpUrl(id) {
    return `https://imslp.org/wiki/${id}`;
}
exports.formatImslpUrl = formatImslpUrl;
/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
function formatWikicommonsUrl(fileName) {
    return `https://commons.wikimedia.org/wiki/File:${fileName}`;
}
exports.formatWikicommonsUrl = formatWikicommonsUrl;
