import { Master } from '../master'

export class SampleListMaster extends Master {
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
}
