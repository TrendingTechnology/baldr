import { Master } from '../master'

export class CounterMaster extends Master {
  name = 'counter'

  displayName = 'Zähler'

  icon = {
    name: 'counter',
    color: 'black',
    size: 'large' as const
  }
}
