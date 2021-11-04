import { Master } from '../master'

type SampleListFieldsRaw = string | SampleListFieldsNormalized

interface SampleListFieldsNormalized {
  samples: string | string[]
}

export class SampleListMaster implements Master {
  name = 'sampleList'

  displayName = 'Audio-Ausschnitte'

  icon = {
    name: 'music',
    color: 'red'
  }

  fieldsDefintion = {
    samples: {
      type: Array,
      required: true,
      description: 'Eine Liste von Audio-Ausschnitten.'
    },
    heading: {
      type: String,
      markup: true,
      description: 'Überschrift der Ausschnitte.',
      required: false
    },
    notNumbered: {
      type: Boolean,
      description: 'Nicht durchnummeriert'
    }
  }

  normalizeFields (fields: SampleListFieldsRaw): SampleListFieldsNormalized {
    if (typeof fields === 'string' || Array.isArray(fields)) {
      fields = { samples: fields }
    }
    return fields
  }

  // collectionMediaUris (fields: SampleListFieldsNormalized) {
  //   return mediaResolver.getUrisFromWrappedSpecs(fields.samples)
  // }
}
