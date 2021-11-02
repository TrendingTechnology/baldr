import { Master } from '../master'

interface FieldData {
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

  normalizeFields (fields: any): FieldData {
    if (typeof fields === 'string') {
      fields = { id: fields }
    }
    return fields
  }

  collectOptionalMediaUris (fields: FieldData): string | string[] | Set<string> | undefined {
    return this.convertYoutubeIdToUri(fields.id)
  }

  private convertYoutubeIdToUri (youtubeId: string): string {
    return `ref:YT_${youtubeId}`
  }
}
