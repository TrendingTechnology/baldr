/**
 * Format some HTTP URLs for various external sites.
 */
/**
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @returns For example: `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
export declare function formatImslpUrl(id: string): string;
/**
 * Format a Musicbrainz recording URL.
 *
 * @param recordingId - A UUID.
 *
 * @returns For example: `https://musicbrainz.org/recording/${RecordingId}`
 */
export declare function formatMusicbrainzRecordingUrl(recordingId: string): string;
/**
 * Format a Musicbrainz work URL.
 *
 * @param workId - A UUID.
 *
 * @returns For example: `https://musicbrainz.org/work/${WorkId}`
 */
export declare function formatMusicbrainzWorkUrl(workId: string): string;
/**
 * Format a Musescore URL.
 *
 * @param The score ID.
 *
 * @returns For example: For example: `https://musescore.com/score/1234`
 */
export declare function formatMusescoreUrl(id: number | string): string;
/**
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @returns For example: `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
export declare function formatWikicommonsUrl(fileName: string): string;
/**
 * Format a Wikidata URL.
 *
 * @param id - The wikidata id. (Should start with `Q`).
 *
 * @returns For example: `https://www.wikidata.org/wiki/Q42`
 */
export declare function formatWikidataUrl(id: string): string;
/**
 * Format a Wikipedia URL.
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 *
 * @returns For example: `https://en.wikipedia.org/wiki/A_Article`
 */
export declare function formatWikipediaUrl(nameSpace: string): string;
/**
 * Format a YouTube URL.
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 *
 * @returns For example: `https://youtu.be/CQYypFMTQcE`
 */
export declare function formatYoutubeUrl(id: string): string;
