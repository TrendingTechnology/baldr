import { MediaUri } from '@bldr/client-media-models'
import { MasterSpec, mapStepFieldDefintions } from '../master-specification'

type ClozeFieldsRaw = string | ClozeFieldsNormalized

interface ClozeFieldsNormalized {
  src: string
  stepSubset?: string
}

export class ClozeMaster implements MasterSpec {
  name = 'cloze'

  displayName = 'Lückentext'

  icon = {
    name: 'cloze',
    color: 'blue',

    /**
     * U+1F5DB
     *
     * @see https://emojipedia.org/decrease-font-size-symbol/
     */
    unicodeSymbol: '🗛'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      assetUri: true
    },
    ...mapStepFieldDefintions(['subset'])
  }

  normalizeFieldsInput (fields: ClozeFieldsRaw): ClozeFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { src: fields }
    }
    const uri = new MediaUri(fields.src)
    if (uri.fragment != null) {
      if (fields.stepSubset == null) {
        fields.stepSubset = uri.fragment
      }
      fields.src = uri.uriWithoutFragment
    }
    return fields
  }

  collectMediaUris (props: ClozeFieldsNormalized): string {
    return props.src
  }
}
