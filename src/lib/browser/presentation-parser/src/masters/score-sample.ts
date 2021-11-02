import { Master } from '../master'

export class ScoreSampleMaster implements Master {
  name = 'scoreSample'

  displayName = 'Notenbeispiel'

  icon = {
    name: 'file-audio',
    color: 'black'
  }

  fieldsDefintion = {
    heading: {
      type: String,
      description: 'Eine Überschrift',
      markup: true
    },
    score: {
      type: String,
      description: 'URI zu einer Bild-Datei, dem Notenbeispiel.',
      assetUri: true,
      required: true
    },
    audio: {
      type: String,
      description: 'URI der entsprechenden Audio-Datei oder des Samples.',
      assetUri: true
    }
  }
}
