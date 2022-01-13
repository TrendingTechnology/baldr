import { MasterSpec } from '../master-specification'

export class WebsiteMaster implements MasterSpec {
  name = 'website'

  displayName = 'Website'

  icon = {
    name: 'master-website',
    color: 'blue',

    /**
     * U+1F310
     *
     * @see https://emojipedia.org/globe-with-meridians/
     */
    unicodeSymbol: '🌐'
  }

  fieldsDefintion = {
    url: {
      type: String,
      required: true,
      description: 'Die URL der Website, die angezeigt werden soll.'
    }
  }

  shortFormField = 'url'
}
