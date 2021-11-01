import { Master } from '../master'

export class DocumentMaster extends Master {
  name = 'document'

  displayName = 'Dokument'

  iconSpec = {
    name: 'file-outline',
    color: 'gray'
  }
}
