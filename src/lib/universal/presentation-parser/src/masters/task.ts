import { MasterSpec } from '../master-specification'

type TaskFieldsRaw = string | TaskFieldsNormalized

interface TaskFieldsNormalized {
  markup: string
}

export class TaskMaster implements MasterSpec {
  name = 'task'

  displayName = 'Arbeitsauftrag'

  icon = {
    name: 'task',
    color: 'yellow-dark',
    size: 'large' as const,

    /**
     * U+2757
     *
     * @see https://emojipedia.org/exclamation-mark/
     */
    unicodeSymbol: '❗'
  }

  fieldsDefintion = {
    markup: {
      type: String,
      required: true,
      markup: true,
      description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
    }
  }

  normalizeFieldsInput (fields: TaskFieldsRaw): TaskFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        markup: fields
      }
    }
    return fields
  }
}
