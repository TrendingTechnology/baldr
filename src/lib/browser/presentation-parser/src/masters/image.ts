import { Master } from '../master'

type MasterFieldsRaw = string | MasterFieldsNormalized

interface MasterFieldsNormalized {
  src: string
  title?: string
  description?: string
  noMeta?: boolean
}

export class ImageMaster implements Master {
  name = 'image'

  displayName = 'Bild'

  icon = {
    name: 'image',
    color: 'green',

    /**
     * U+1F5BC U+FE0F
     * @see https://emojipedia.org/framed-picture/
     */
    unicodeSymbol: '🖼️'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Bild-Datei.',
      assetUri: true
    },
    title: {
      type: String,
      markup: true,
      description: 'Ein Titel, der angezeigt wird.'
    },
    description: {
      type: String,
      markup: true,
      description: 'Eine Beschreibung, die angezeigt wird.'
    },
    noMeta: {
      type: Boolean,
      description:
        'Beeinflusst, ob Metainformation wie z. B. Titel oder Beschreibung angezeigt werden sollen.',
      default: false
    }
  }

  normalizeFieldsInput (fields: MasterFieldsRaw): MasterFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { src: fields }
    }
    return fields
  }

  collectMediaUris (fields: MasterFieldsNormalized): string {
    return fields.src
  }
}
