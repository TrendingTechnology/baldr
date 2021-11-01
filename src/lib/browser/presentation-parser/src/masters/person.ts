import { Master } from '../master'

interface FieldData {
  personId: string
}

type RawFieldData = string | FieldData

export class PersonMaster extends Master {
  name = 'person'

  displayName = 'Porträt'

  icon = {
    name: 'person',
    color: 'orange'
  }

  fieldsDefintion = {
    personId: {
      type: String,
      description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
    }
  }

  normalizeFields (fields: RawFieldData) {
    if (typeof fields === 'string') {
      return {
        personId: fields
      }
    }
    return fields
  }

  collectMediaUris (fields: FieldData): string {
    return this.convertPersonIdToMediaUri(fields.personId)
  }

  private convertPersonIdToMediaUri (personId: string): string {
    return `ref:PR_${personId}`
  }
}
