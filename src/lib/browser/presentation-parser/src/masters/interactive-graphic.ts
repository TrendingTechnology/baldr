import { Master } from '../master'

export class InteractiveGraphicMaster extends Master {
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
}
