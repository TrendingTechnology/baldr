import { Master } from '../master'

type GroupFieldsRaw = string

interface GroupFieldsNormalized {
  groupId: string
}

export class GroupMaster implements Master {
  name = 'group'

  displayName = 'Gruppe'

  icon = {
    name: 'account-group',
    color: 'orange'
  }

  fieldsDefintion = {
    groupId: {
      type: String,
      required: true,
      description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
    }
  }

  normalizeFields (fields: GroupFieldsRaw): GroupFieldsNormalized {
    if (typeof fields === 'string') {
      return {
        groupId: fields
      }
    }
    return fields
  }

  collectMediaUris (fields: GroupFieldsNormalized): string {
    return this.convertGroupIdToMediaId(fields.groupId)
  }

  private convertGroupIdToMediaId (groupId: string) {
    return `ref:GR_${groupId}`
  }
}
