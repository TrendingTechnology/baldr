import { Master } from '../master'

const DEFAULT_LANGUAGE = 'de'

export class WikipediaMaster implements Master {
  name = 'wikipedia'

  displayName = 'Wikipedia'

  icon = {
    name: 'wikipedia',
    color: 'black'
  }

  fieldsDefintion = {
    title: {
      type: String,
      required: true,
      description:
        'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
    },
    language: {
      type: String,
      description:
        'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
      default: DEFAULT_LANGUAGE
    },
    oldid: {
      type: Number,
      description: 'Eine alte Version verwenden.'
    }
  }
}
