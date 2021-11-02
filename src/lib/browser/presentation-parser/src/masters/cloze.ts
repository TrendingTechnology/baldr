import { Master } from '../master'

export class ClozeMaster extends Master {
  name = 'cloze'

  displayName = 'Lückentext'

  icon = {
    name: 'cloze',
    color: 'blue'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      assetUri: true
    }
  }
}
