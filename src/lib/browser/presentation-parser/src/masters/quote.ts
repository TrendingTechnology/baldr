import { Master } from '../master'

export class QuoteMaster extends Master {
  name = 'quote'

  displayName = 'Zitat'

  iconSpec = {
    name: 'quote',
    color: 'brown',
    size: 'large' as const
  }
}
