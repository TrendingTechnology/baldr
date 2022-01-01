import { MasterSpec } from '../master-specification'

export type PersonFieldsRaw = string | PersonFieldsNormalized

interface PersonFieldsNormalized {
  personId: string
}

export class PersonMaster implements MasterSpec {
  name = 'person'

  displayName = 'Porträt'

  icon = {
    name: 'person',
    color: 'orange',

    /**
     *  U+1F9D1
     *
     * @see https://emojipedia.org/person/
     */
    unicodeSymbol: '🧑'
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
