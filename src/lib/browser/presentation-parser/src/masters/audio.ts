import { Master } from '../master'

interface AudioFieldData {
  src: string
  title?: string
  composer?: string
  artist?: string
  partOf?: string
  cover?: string
  description?: string
  autoplay?: boolean
  playthrough?: boolean
}

type RawFieldData = string | AudioFieldData

export class AudioMaster extends Master {
  name = 'audio'

  displayName = 'Hörbeispiel'

  icon = {
    name: 'music',
    color: 'brown'
  }

  fieldsDefintion = {
    src: {
      type: String,
      required: true,
      description:
        'Eine Medien-Datei-URI, z. B. `ref:Fuer-Elise` oder eine Sample-URI (`ref:Fuer-Elise#complete`).',
      assetUri: true
    },
    title: {
      type: String,
      markup: true,
      description: 'Der Titel des Audio-Ausschnitts.',
      required: true
    },
    composer: {
      type: String,
      markup: true,
      description: 'Der/Die KomponistIn des Audio-Ausschnitts.'
    },
    artist: {
      type: String,
      markup: true,
      description: 'Der/Die InterpretIn des Audio-Ausschnitts.'
    },
    partOf: {
      type: String,
      markup: true,
      description: 'Teil eines übergeordneten Werks.'
    },
    cover: {
      type: String,
      description:
        'Eine Medien-Datei-URI, die als Cover-Bild angezeigt werden soll.',
      assetUri: true
    },
    description: {
      type: String,
      markup: true,
      description: 'Ein längerer Beschreibungstext.'
    },
    autoplay: {
      type: Boolean,
      default: false,
      description: 'Den Audio-Ausschnitt automatisch abspielen.'
    },
    playthrough: {
      type: Boolean,
      default: false,
      description:
        'Über die Folien hinwegspielen. Nicht stoppen beim Folienwechsel.'
    }
  }

  normalizeFields (fields: RawFieldData): AudioFieldData {
    if (typeof fields === 'string') {
      fields = { src: fields }
    }
    return fields
  }

  resolveMediaUris (fields: AudioFieldData): Set<string> {
    const uris = new Set([fields.src])
    if (fields.cover) {
      uris.add(fields.cover)
    }
    return uris
  }
}
