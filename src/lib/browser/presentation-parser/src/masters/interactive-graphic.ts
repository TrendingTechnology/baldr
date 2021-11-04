import { Master } from '../master'

type InteractiveGraphicFieldsRaw = string | InteractiveGraphicFieldsNormalized

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
    }
  }

  normalizeFields (
    fields: InteractiveGraphicFieldsRaw
  ): InteractiveGraphicFieldsNormalized {
    if (typeof fields === 'string') {
      fields = { src: fields } as InteractiveGraphicFieldsNormalized
    }
    if (fields.stepSelector == null) {
      fields.stepSelector = 'g[inkscape\\:groupmode="layer"]'
    }
    return fields
  }

  collectMediaUris (fields: InteractiveGraphicFieldsNormalized): string {
    return fields.src
  }
}
