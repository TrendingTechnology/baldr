import { Master, shortenText } from '../master'

export type SectionFieldsRaw = string | SectionFieldsNormalized

interface SectionFieldsNormalized {
  heading: string
}

export class SectionMaster implements Master {
  name = 'section'

  displayName = 'Abschnitt'

  icon = {
    name: 'file-tree',
    color: 'orange-dark',

    /**
     * U+2796
     *
     * @see https://emojipedia.org/minus/
     */
    unicodeSymbol: '➖'
  }

  fieldsDefintion = {
    heading: {
      type: String,
      required: true,
      markup: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    }
  }

  shortFormField = 'heading'

  deriveTitleFromFields (fields: SectionFieldsNormalized): string {
    return shortenText(fields.heading)
  }
}
