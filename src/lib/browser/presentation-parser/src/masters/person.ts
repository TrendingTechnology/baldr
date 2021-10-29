import { Master } from './_types'

interface FieldData {
  personId: string
}

type RawFieldData = string | FieldData

export class PersonMaster extends Master {
  name = 'person'
  displayName = 'Porträt'

  fieldsDefintion = {
    personId: {
      type: String,
      description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
    }
  }

  normalizeFields (props: RawFieldData) {
    if (typeof props === 'string') {
      return {
        personId: props
      }
    }
    return props
  }
}
