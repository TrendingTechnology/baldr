import { MasterSpec, mapStepFieldDefintions } from '../master-specification'

type InteractiveGraphicFieldsRaw = string | InteractiveGraphicFieldsNormalized

export const inkscapeModeNames = ['layer', 'layer+', 'group', 'none'] as const
export type InkscapeMode = typeof inkscapeModeNames[number]

interface InteractiveGraphicFieldsNormalized {
  src: string
  stepSelector: string
}

export class InteractiveGraphicMaster implements MasterSpec {
  name = 'interactiveGraphic'

  displayName = 'Interaktive Grafik'

  description =
    'Diese Master-Folie ist dazu gedacht, mit *Inkscape* erstellte SVG-Dateien darzustellen.'

  icon = {
    name: 'master-interactive-graphic',
    color: 'blue',
    showOnSlides: false,

    /**
     * U+1F4CA
     *
     * @see https://emojipedia.org/bar-chart/
     */
    unicodeSymbol: '📊'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      assetUri: true
    },
    mode: {
      description:
        'layer (Inkscape-Ebenen), layer+ (Elemente der Inkscape-Ebenen), group (Gruppierungen), none (Alles eingeblendet)',
      default: 'layer',
      validate: (input: any) => {
        return inkscapeModeNames.includes(input)
      }
    },
    ...mapStepFieldDefintions(['selector', 'subset'])
  }

  normalizeFieldsInput (
    fields: InteractiveGraphicFieldsRaw
  ): InteractiveGraphicFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { src: fields } as InteractiveGraphicFieldsNormalized
    }
    return fields
  }

  collectMediaUris (fields: InteractiveGraphicFieldsNormalized): string {
    return fields.src
  }
}
