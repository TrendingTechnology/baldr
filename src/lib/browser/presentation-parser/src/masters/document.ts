import { Master } from '../master'

type DocumentFieldsRaw = string | DocumentFieldsNormalized

interface DocumentFieldsNormalized {
  src: string
}

export class DocumentMaster implements Master {
  name = 'document'

  displayName = 'Dokument'

  icon = {
    name: 'file-outline',
    color: 'gray'
  }

  fieldsDefintion = {
    src: {
      type: String,
      description: 'URI eines Dokuments.'
    },
    page: {
      type: Number,
      description: 'Nur eine Seite des PDFs anzeigen'
    }
  }

  normalizeFieldsInput (fields: DocumentFieldsRaw) {
    if (typeof fields === 'string') {
      fields = {
        src: fields
      }
    }
    return fields
  }

  collectMediaUris (fields: DocumentFieldsNormalized): string {
    return fields.src
  }
}
