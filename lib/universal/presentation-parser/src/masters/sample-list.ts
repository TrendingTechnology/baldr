import {
  MasterSpec,
  extractUrisFromFuzzySpecs,
  WrappedUri,
  WrappedUriList,
  Resolver,
  Slide,
  Sample
} from '../master-specification'

type SampleListFieldsRaw = string | string[] | SampleListFields

interface SampleListFields {
  samples: WrappedUri[]
  heading?: string
  notNumbered?: boolean
}

interface SampleListData {
  samples: Sample[]
}

export interface SampleListSlide extends Slide {
  fields: SampleListFields
  data: SampleListData
}

export class SampleListMaster implements MasterSpec {
  name = 'sampleList'

  displayName = 'Audio-Ausschnitte'

  icon = {
    name: 'master-sample-list',
    color: 'red',

    /**
     * U+1F501
     *
     * @see https://emojipedia.org/repeat-button/
     */
     unicodeSymbol: '🔁'
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

  normalizeFieldsInput (
    fields: SampleListFieldsRaw
  ): SampleListFields {
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

  collectMediaUris (fields: SampleListFields) {
    return extractUrisFromFuzzySpecs(fields.samples)
  }

  collectFieldsAfterResolution (
    fields: SampleListFields,
    resolver: Resolver
  ): SampleListFields {
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

  collectStepsAfterResolution (
    fields: SampleListFields,
    slide: Slide
  ): void {
    for (const wrappedUri of fields.samples) {
      const title = wrappedUri.title != null ? wrappedUri.title : wrappedUri.uri
      slide.stepCollector.add(title)
    }
  }
}
