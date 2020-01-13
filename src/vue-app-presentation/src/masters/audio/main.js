import { GrabFromObjects } from '@/lib.js'

const example = `
---
slides:

- title: Custom composer
  audio:
    src: id:Fischer-Dieskau_Marmotte
    composer: Ludwig B. (Custom composer)
    autoplay: true

- title: 'Autoplay: yes'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden
    title: Custom title
    autoplay: true

- title: 'Autoplay: no'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden
    title: Custom title
    autoplay: false

- title: 'Custom title'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden
    title: Custom title

- title: 'Custom artist'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden
    artist: Custom artist

- title: 'Custom cover'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden
    cover: filename:Beethoven_Ludwig-van.jpg
    title: Custom cover

- title: 'Without media file URI schemes.'
  audio:
    src: Du-bist-als-Kind-zu-heiss-gebadet-worden
    cover: Beethoven
    title: Custom cover

- title: 'URL: id:'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden

- title: 'URL: filename:'
  audio:
    src: filename:Ich-hab-zu-Haus-ein-Grammophon.m4a
`

export default {
  title: 'Hörbeispiel',
  props: {
    src: {
      type: [String, Array],
      required: true,
      description: 'Eine Medien-Datei-URI, z. B. `id:Fuer-Elise` oder eine Sample-URI (`id:Fuer-Elise#complete`).',
      mediaFileUri: true
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
    cover: {
      type: String,
      description: 'Eine Medien-Datei-URI, die als Cover-Bild angezeigt werden soll.',
      mediaFileUri: true
    },
    autoplay: {
      type: Boolean,
      default: false,
      description: 'Den Audio-Ausschnitt automatisch abspielen.'
    },
    playthrough: {
      type: Boolean,
      default: false,
      description: 'Über die Folien hinwegspielen. Nicht stoppen beim Folienwechsel.'
    }
  },
  icon: {
    name: 'music',
    color: 'brown'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { src: props }
    }
    return props
  },
  resolveMediaUris (props) {
    const uris = [props.src]
    if (props.cover) uris.push(props.cover)
    return uris
  },
  async enterSlide ({ newProps }) {
    const props = newProps
    this.$media.player.load(props.src)
    if (newProps.autoplay) {
      await this.$media.player.start()
    }
  },
  collectPropsMain (props) {
    const sample = this.$store.getters['media/sampleByUri'](props.src)
    const mediaFile = sample.mediaFile

    const grab = new GrabFromObjects(props, mediaFile)
    const artist = grab.property('artist')
    const composer = grab.property('composer')
    let title
    if (props.title) {
      title = props.title
    } else {
      title = sample.titleFormated
    }

    let previewHttpUrl
    if (props.cover) {
      const coverFile = this.$store.getters['media/mediaFileByUri'](props.cover)
      previewHttpUrl = coverFile.httpUrl
    } else if ('previewHttpUrl' in sample) {
      previewHttpUrl = sample.previewHttpUrl
    }
    return {
      previewHttpUrl,
      artist,
      composer,
      title
    }
  }
}
