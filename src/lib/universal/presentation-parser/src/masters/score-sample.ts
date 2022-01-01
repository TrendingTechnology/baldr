import { MasterSpec } from '../master-specification'

type ScoreSampleFieldsRaw = string | ScoreSampleFieldsNormalized

interface ScoreSampleFieldsNormalized {
  score: string
  audio?: string
}

export class ScoreSampleMaster implements MasterSpec {
  name = 'scoreSample'

  displayName = 'Notenbeispiel'

  icon = {
    name: 'file-audio',
    color: 'black',

    /**
     * U+1F3B5
     *
     * @see https://emojipedia.org/musical-note/
     */
    unicodeSymbol: '🎵'
  }

  fieldsDefintion = {
    heading: {
      type: String,
      description: 'Eine Überschrift',
      markup: true
    },
    score: {
      type: String,
      description: 'URI zu einer Bild-Datei, dem Notenbeispiel.',
      assetUri: true,
      required: true
    },
    audio: {
      type: String,
      description: 'URI der entsprechenden Audio-Datei oder des Samples.',
      assetUri: true
    }
  }

  normalizeFieldsInput (fields: ScoreSampleFieldsRaw): ScoreSampleFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        score: fields
      }
    }
    return fields
  }

  collectMediaUris (fields: ScoreSampleFieldsNormalized) {
    const uris = new Set([fields.score])
    if (fields.audio != null) {
      uris.add(fields.audio)
    }
    return uris
  }
}
