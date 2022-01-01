import { MasterSpec } from '../master-specification'

type VideoFieldsRaw = string | VideoFieldsNormalized

interface VideoFieldsNormalized {
  src: string
}

export class VideoMaster implements MasterSpec {
  name = 'video'

  displayName = 'Video'

  icon = {
    name: 'video-vintage',
    color: 'purple',

    /**
     * @see https://emojipedia.org/film-projector/
     */
    unicodeSymbol: '📽️'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Video-Datei.',
      assetUri: true
    },
    showMeta: {
      type: Boolean,
      description: 'Zeige Metainformationen'
    }
  }

  normalizeFieldsInput (fields: VideoFieldsRaw): VideoFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { src: fields }
    }
    return fields
  }

  collectMediaUris (fields: VideoFieldsNormalized): string {
    return fields.src
  }
}
