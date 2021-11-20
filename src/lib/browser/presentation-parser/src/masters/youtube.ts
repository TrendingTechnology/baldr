import { Master } from '../master'

type YoutubeFieldsRaw = number | string | YoutubeFieldNormalized

interface YoutubeFieldNormalized {
  id: string
  heading?: string
  info?: string
}

export class YoutubeMaster implements Master {
  name = 'youtube'

  displayName = 'YouTube'

  icon = {
    name: 'youtube',
    color: 'red'
  }

  fieldsDefintion = {
    id: {
      type: String,
      required: true,
      description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
    },
    heading: {
      type: String,
      description: 'Eigene Überschrift',
      markup: true
    },
    info: {
      type: String,
      description: 'längerer Informations-Text',
      markup: true
    }
  }

  normalizeFieldsInput (fields: YoutubeFieldsRaw): YoutubeFieldNormalized {
    if (typeof fields === 'string') {
      fields = { id: fields }
    } else if (typeof fields === 'number') {
      fields = { id: fields.toString() }
    }
    return fields
  }

  collectOptionalMediaUris (
    fields: YoutubeFieldNormalized
  ): string | string[] | Set<string> | undefined {
    return this.convertYoutubeIdToUri(fields.id)
  }

  private convertYoutubeIdToUri (youtubeId: string): string {
    return `ref:YT_${youtubeId}`
  }
}
