import { Master } from '../master'

export class GenericMaster extends Master {
  name = 'generic'

  displayName = 'Folie'

  iconSpec = {
    name: 'file-presentation-box',
    color: 'gray',
    showOnSlides: false
  }
}
