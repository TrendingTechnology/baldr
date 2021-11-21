import { Master, Resolver, Asset, Sample } from '../master'

export type AudioFieldsRaw = string | AudioFieldsNormalized

interface AudioFieldsNormalized {
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

interface AudioFieldsResolved extends AudioFieldsNormalized {
  asset: Asset
  sample: Sample
  title: string
  previewHttpUrl?: string
}

export class AudioMaster implements Master {
  name = 'audio'

  displayName = 'Hörbeispiel'

  icon = {
    name: 'music',
    color: 'brown',

    /**
     *  U+1F50A
     *
     * @see https://emojipedia.org/speaker-high-volume/
     */
    unicodeSymbol: '🔊'
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
      description: 'Der Titel des Audio-Ausschnitts.'
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

  shortFormField = 'src'

  collectMediaUris (fields: AudioFieldsNormalized): Set<string> {
    const uris = new Set([fields.src])
    if (fields.cover) {
      uris.add(fields.cover)
    }
    return uris
  }

  collectFieldsAfterResolution (
    fields: AudioFieldsNormalized,
    resolver: Resolver
  ): AudioFieldsResolved {
    const sample = resolver.getSample(fields.src)
    const asset = sample.asset

    const artist = fields.artist == null ? asset.yaml.artist : fields.artist
    const composer =
      fields.composer == null ? asset.yaml.composer : fields.composer
    const description =
      fields.description == null ? asset.yaml.description : fields.description
    const partOf = fields.partOf == null ? asset.yaml.partOf : fields.partOf
    const title = fields.title == null ? sample.titleSafe : fields.title

    let previewHttpUrl
    if (fields.cover != null) {
      const coverFile = resolver.getAsset(fields.cover)
      previewHttpUrl = coverFile.httpUrl
    } else if (asset.previewHttpUrl != null) {
      previewHttpUrl = asset.previewHttpUrl
    }

    return Object.assign(
      {
        title,
        composer,
        artist,
        description,
        sample,
        asset,
        partOf,
        previewHttpUrl
      },
      fields
    )
  }
}
