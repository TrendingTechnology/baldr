import { Master } from '../master'

export class DocumentMaster extends Master {
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
}
