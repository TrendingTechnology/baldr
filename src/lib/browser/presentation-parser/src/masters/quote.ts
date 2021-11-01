import { Master } from '../master'

export class QuoteMaster extends Master {
  name = 'quote'

  displayName = 'Zitat'

  icon = {
    name: 'quote',
    color: 'brown',
    size: 'large' as const
  }
}
