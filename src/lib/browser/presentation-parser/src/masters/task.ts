import { Master } from '../master'

export class TaskMaster extends Master {
  name = 'task'

  displayName = 'Arbeitsauftrag'

  icon = {
    name: 'task',
    color: 'yellow-dark',
    size: 'large' as const
  }
}
