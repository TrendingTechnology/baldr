<template>
  <div v-if="mediaFile" class="vc_audio_master">
    <img
      :src="coverComputed"
      class="preview"
      v-if="coverComputed"
    />

    <!-- <p>
      <audio controls :src="mediaFile.httpUrl"/>
    </p> -->

    <p
      class="composer person"
      v-if="composerComputed"
      v-html="composerComputed"
    />

    <p
      class="title piece"
      v-if="titleComputed"
      v-html="titleComputed"
    />

    <p
      class="artist person"
      v-if="artistComputed"
      v-html="artistComputed"
    />
  </div>
</template>

<script>
import { markupToHtml } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

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

export const master = {
  title: 'Hörbeispiel',
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
  }
}

export default {
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
  computed: {
    ...mapGetters(['slideCurrent']),
    artistComputed () {
      if (this.artist) return this.artist
      if ('artist' in this.mediaFile) {
        return  markupToHtml(this.mediaFile.artist)
      }
      return ''
    },
    coverComputed () {
      if (this.cover) {
        const mediaFile = this.$store.getters['media/mediaFileByUri'](this.cover)
        return mediaFile.httpUrl
      }
      if ('previewHttpUrl' in this.mediaFile) {
        return this.mediaFile.previewHttpUrl
      }
      return ''
    },
    composerComputed () {
      if (this.composer) return this.composer
      if ('composer' in this.mediaFile) {
        return markupToHtml(this.mediaFile.composer)
      }
      return ''
    },
    stepNoCurrent () {
      return this.slideCurrent.renderData.stepNoCurrent - 1
    },
    titleComputed () {
      if (this.title) return this.title
      if ('title' in this.mediaFile) {
        return markupToHtml(this.mediaFile.title)
      }
      return ''
    },
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.src)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_audio_master {
    text-align: center;
    font-size: 3vw;

    p {
      margin: 0;
    }

    .composer {
      font-size: 1.2em;
    }

    .title {
      font-size: 1.1em;
    }

    .artist {
      margin-top: 5vw;
      font-size: 0.7em;
    }

    img.preview {
      height: 30vh;
      width: 30vh;
      object-fit: cover;
    }
  }
</style>
