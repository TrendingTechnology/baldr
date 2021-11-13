import { Master, mapStepFieldDefintions } from '../master'

type InteractiveGraphicFieldsRaw = string | InteractiveGraphicFieldsNormalized

type InkscapeMode = 'layer' | 'layer+' | 'group'

interface InteractiveGraphicFieldsNormalized {
  src: string
  stepSelector: string
}

export class InteractiveGraphicMaster implements Master {
  name = 'interactiveGraphic'

  displayName = 'Interaktive Grafik'

  icon = {
    name: 'image',
    color: 'blue',
    showOnSlides: false
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      assetUri: true
    },
    mode: {
      description: 'layer (Inkscape-Ebenen), layer+ (Elemente der Inkscape-Ebenen), group (Gruppierungen)',
      default: 'layer',
      validate: (input: any) => {
        return ['layer', 'layer+', 'group'].includes(input)
      }
    },
    ...mapStepFieldDefintions(['selector', 'subset'])
  }

  normalizeFields (
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
