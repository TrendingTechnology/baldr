import {
  Master,
  extractUrisFromFuzzySpecs,
  WrappedUri,
  WrappedUriList,
  Resolver
} from '../master'

type SampleListFieldsRaw = string | string[] | SampleListFieldsNormalized

interface SampleListFieldsNormalized {
  samples: WrappedUri[]
  heading?: string
  notNumbered?: boolean
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
    let samples
    if (typeof fields === 'string' || Array.isArray(fields)) {
      samples = fields
      fields = { samples: [] }
    } else {
      samples = fields.samples
    }
    const wrappedUris = new WrappedUriList(samples)
    fields.samples = wrappedUris.list
    return fields
  }

  collectFields (
    fields: SampleListFieldsNormalized,
    resolver: Resolver
  ): SampleListFieldsNormalized {
    if (fields.samples.length === 1) {
      const asset = resolver.getAsset(fields.samples[0].uri)
      if (asset.samples != null) {
        const uriList = []
        for (const sample of asset.samples.getAll()) {
          uriList.push({ uri: sample.ref, title: sample.titleSafe })
        }
        fields.samples = uriList
      }
    }
    return fields
  }

  collectMediaUris (fields: SampleListFieldsNormalized) {
    return extractUrisFromFuzzySpecs(fields.samples)
  }
}
