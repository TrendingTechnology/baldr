import { Master } from '../master'

export class TaskMaster extends Master {
  name = 'task'

  displayName = 'Arbeitsauftrag'

  icon = {
    name: 'task',
    color: 'yellow-dark',
    size: 'large' as const
  }

  fieldsDefintion = {
    markup: {
      type: String,
      required: true,
      markup: true,
      description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
    }
  }
}
