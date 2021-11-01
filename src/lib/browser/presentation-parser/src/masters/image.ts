import { Master } from '../master'

interface FieldData {
  src: string
  title?: string
  description?: string
  noMeta?: boolean
}

export class ImageMaster extends Master {
  name = 'image'

  displayName = 'Bild'

  iconSpec = {
    name: 'image',
    color: 'green'
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

  public normalizeFields (fields: any): FieldData {
    if (typeof fields === 'string') {
      fields = { src: fields }
    }
    return fields
  }

  protected collectMediaUris (fields: FieldData): string {
    return fields.src
  }
}
