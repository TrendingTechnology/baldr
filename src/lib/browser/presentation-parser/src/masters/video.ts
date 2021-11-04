import { Master } from '../master'

type VideoFieldsRaw = string | VideoFieldsNormalized

interface VideoFieldsNormalized {
  src: string
}

export class VideoMaster implements Master {
  name = 'video'

  displayName = 'Video'

  icon = {
    name: 'video-vintage',
    color: 'purple'
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

  normalizeFields (fields: VideoFieldsRaw): VideoFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { src: fields }
    }
    return fields
  }

  collectMediaUris (fields: VideoFieldsNormalized): string {
    return fields.src
  }
}
