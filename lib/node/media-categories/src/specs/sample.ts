import { MediaCategoriesTypes } from '@bldr/type-definitions'

const sampleSpecKeys = [
  'title',
  'ref',
  'startTime',
  'duration',
  'endTime',
  'fadeIn',
  'fadeOut',
  'shortcut'
]

/**
 * The meta data type specification “sample”.
 *
 * @see @bldr/type-definitions/asset.SampleYamlFormat
 */
export const sample: MediaCategoriesTypes.Category = {
  title: 'Audio/Video-Ausschnitt',
  props: {
    samples: {
      title: 'Ausschnitte',
      validate (value: any): boolean {
        if (!Array.isArray(value)) {
          console.log(`Samples must be an array.`)
          return false
        }
        for (const sampleSpec of value) {
          for (const key in sampleSpec) {
            if (!sampleSpecKeys.includes(key)) {
              console.log(`Unknown sample key: ${key}`)
              return false
            }
          }
        }
        return true
      }
    },
    startTime: {
      title: 'Startzeitpunkt des Samples'
    },
    duration: {
      title: 'Dauer des Ausschnitts'
    },
    endTime: {
      title: 'Endzeitpunkt des Samples'
    },
    fadeIn: {
      title: 'Dauer der Einblendzeit'
    },
    fadeOut: {
      title: 'Dauer der Ausblendzeit'
    }
  }
}
