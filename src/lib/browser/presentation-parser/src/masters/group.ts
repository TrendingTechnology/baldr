import { Master } from '../master'

export type GroupFieldsRaw = string | GroupFieldsNormalized

export interface GroupFieldsNormalized {
  groupId: string
}

export class GroupMaster implements Master {
  name = 'group'

  displayName = 'Gruppe'

  icon = {
    name: 'account-group',
    color: 'orange',

    /**
     * U+1F93C
     *
     * @see https://emojipedia.org/people-wrestling/
     */
    unicodeSymbol: '🤼'
  }

  fieldsDefintion = {
    groupId: {
      type: String,
      required: true,
      description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
    }
  }

  shortFormField = 'groupId'

  collectMediaUris (fields: GroupFieldsNormalized): string {
    return this.convertGroupIdToMediaId(fields.groupId)
  }

  private convertGroupIdToMediaId (groupId: string) {
    return `ref:GR_${groupId}`
  }
}
