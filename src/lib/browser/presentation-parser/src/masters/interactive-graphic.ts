import { Master } from '../master'

export class InteractiveGraphicMaster extends Master {
  name = 'interactiveGraphic'

  displayName = 'Interaktive Grafik'

  iconSpec = {
    name: 'image',
    color: 'blue',
    showOnSlides: false
  }
}
