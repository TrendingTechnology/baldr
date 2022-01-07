import { MediaCategoriesTypes } from '@bldr/type-definitions'

import { validateMediaId, validateUuid } from '../main'
import { getAudioMetadataValue } from '../audio-metadata'

/**
 * The meta data type specification “recording”.
 */
export const recording: MediaCategoriesTypes.Category = {
  title: 'Aufnahme',
  detectCategoryByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
  props: {
    artist: {
      title: 'Interpret',
      description: 'Der/die Interpret/in eines Musikstücks.',
      wikidata: {
        // Interpret | Interpretin | Interpretinnen | Darsteller
        fromClaim: 'P175',
        secondQuery: 'queryLabels',
        format: 'formatList'
      },
      derive: async function ({ filePath }) {
        return getAudioMetadataValue('artist', filePath)
      }
    },
    musicbrainzRecordingId: {
      title: 'MusicBrainz-Aufnahme-ID',
      validate: validateUuid,
      wikidata: {
        fromClaim: 'P4404',
        format: 'formatSingleValue'
      },
      derive: async function ({ filePath }) {
        return getAudioMetadataValue('musicbrainz_recording_id', filePath)
      }
    },
    // see composition creationDate
    year: {
      title: 'Jahr',
      state: 'absent'
      // wikidata: {
      //   // Veröffentlichungsdatum
      //   fromClaim: 'P577',
      //   format: 'formatYear'
      // }
    },
    album: {
      title: 'Album',
      state: 'absent'
    },
    recordingYear: {
      title: 'Aufnahme-Jahr',
      state: 'absent'
    },
    cover: {
      title: 'Vorschau-Bild',
      validate: validateMediaId
    },
    coverSource: {
      title: 'Cover-Quelle',
      description: 'HTTP-URL des Vorschau-Bildes.',
      validate (value) {
        return value.match(/^https?.*$/)
      }
    }
  }
}
