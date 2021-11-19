import { Master } from '../master'

export type PersonFieldsRaw = string | PersonFieldsNormalized

interface PersonFieldsNormalized {
  personId: string
}

export class PersonMaster implements Master {
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

  shortFormField = 'personId'

  collectMediaUris (fields: PersonFieldsNormalized): string {
    return this.convertPersonIdToMediaUri(fields.personId)
  }

  private convertPersonIdToMediaUri (personId: string): string {
    return `ref:PR_${personId}`
  }
}
