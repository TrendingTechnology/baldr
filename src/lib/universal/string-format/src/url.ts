/**
 * Format a Wikidata URL.
 * `https://www.wikidata.org/wiki/Q42`
 */
export function formatWikidataUrl (id: string): string {
  id = String(id)
  const idNumber: number = parseInt(id.replace(/^Q/, ''))
  // https://www.wikidata.org/wiki/Q42
  return `https://www.wikidata.org/wiki/Q${idNumber}`
}

/**
 * Format a Wikipedia URL.
 *
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 */
export function formatWikipediaUrl (nameSpace: string): string {
  // https://de.wikipedia.org/wiki/Gesch%C3%BCtztes_Leerzeichen
  // https://en.wikipedia.org/wiki/Non-breaking_space
  const segments = nameSpace.split(':')
  const lang = segments[0]
  const slug = encodeURIComponent(segments[1])
  return `https://${lang}.wikipedia.org/wiki/${slug}`
}

/**
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 *
 * @param recordingId - A UUID.
 */
export function formatMusicbrainzRecordingUrl (recordingId: string): string {
  return `https://musicbrainz.org/recording/${recordingId}`
}

/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 *
 * @param workId - A UUID.
 */
export function formatMusicbrainzWorkUrl (workId: string): string {
  return `https://musicbrainz.org/work/${workId}`
}

/**
 * Format a YouTube URL.
 *
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
export function formatYoutubeUrl (id: string): string {
  return `https://youtu.be/${id}`
}

/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
export function formatImslpUrl (id: string): string {
  return `https://imslp.org/wiki/${id}`
}

/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
export function formatWikicommonsUrl (fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${fileName}`
}
