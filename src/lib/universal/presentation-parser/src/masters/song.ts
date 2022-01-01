import { Master } from '../master'

type SongFieldsRaw = string | SongFieldsNormalized

interface SongFieldsNormalized {
  songId: string
}

export class SongMaster implements Master {
  name = 'song'

  displayName = 'Lied'

  icon = {
    name: 'file-audio',
    color: 'green',

    /**
     * U+1F3BC
     *
     * @see https://emojipedia.org/musical-score/
     */
     unicodeSymbol: '🎼'
  }

  fieldsDefintion = {
    songId: {
      type: String,
      description: 'Die ID des Liedes'
    }
  }

  normalizeFieldsInput (fields: SongFieldsRaw): SongFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { songId: fields }
    }
    return fields
  }

  collectMediaUris (fields: SongFieldsNormalized) {
    return this.convertSongIdToRef(fields.songId)
  }

  private convertSongIdToRef (songId: string): string {
    return `ref:LD_${songId}`
  }
}
