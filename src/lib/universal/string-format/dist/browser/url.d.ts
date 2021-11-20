/**
 * Format a Wikidata URL.
 * `https://www.wikidata.org/wiki/Q42`
 */
export declare function formatWikidataUrl(id: string): string;
/**
 * Format a Wikipedia URL.
 *
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 */
export declare function formatWikipediaUrl(nameSpace: string): string;
/**
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 *
 * @param recordingId
 */
export declare function formatMusicbrainzRecordingUrl(recordingId: string): string;
/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 *
 * @param workId
 */
export declare function formatMusicbrainzWorkUrl(workId: string): string;
/**
 * Format a YouTube URL.
 *
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
export declare function formatYoutubeUrl(id: string): string;
/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
export declare function formatImslpUrl(id: string): string;
/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
export declare function formatWikicommonsUrl(fileName: string): string;
