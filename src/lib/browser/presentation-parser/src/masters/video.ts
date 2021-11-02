import { Master } from '../master'

export class VideoMaster implements Master {
  name = 'video'

  displayName = 'Video'

  icon = {
    name: 'video-vintage',
    color: 'purple'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Video-Datei.',
      assetUri: true
    },
    showMeta: {
      type: Boolean,
      description: 'Zeige Metainformationen'
    }
  }
}
