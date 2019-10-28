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
    >{{ composerComputed }}</p>

    <p
      class="title piece"
      v-if="titleComputed"
    >{{ titleComputed }}</p>

    <p
      class="artist person"
      v-if="artistComputed"
    >{{ artistComputed }}</p>
  </div>
</template>

<script>
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

- title: 'URL: id:'
  audio:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden

- title: 'URL: filename:'
  audio:
    src: filename:Ich-hab-zu-Haus-ein-Grammophon.m4a

- title: 'Multiple audio files to resolve'
  audio:
  - id:Du-bist-als-Kind-zu-heiss-gebadet-worden
  - filename:Ich-hab-zu-Haus-ein-Grammophon.m4a
`

export const master = {
  title: 'Hörbeispiel',
  icon: 'music',
  color: 'brown',
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string' || Array.isArray(props)) {
      props = { src: props }
    }
    if (typeof props.src === 'string') {
      props.src = [props.src]
    }
    if (props.begin && props.end && !props.duration) {
      props.duration = props.end - props.begin
    }
    return props
  },
  stepCount (props) {
    return props.src.length
  },
  resolveMediaUris (props) {
    // Clone array to prevent false step count.
    const uris = props.src.slice(0)
    if (props.cover) uris.push(props.cover)
    return uris
  },
  async enterSlide ({ newProps }) {
    const props = newProps
    this.$media.player.load(props.src[0])
    if (newProps.autoplay) {
      await this.$media.player.start()
    }
  }
}

export default {
  props: {
    src: {
      type: [String, Array],
      required: true
    },
    title: {
      type: String
    },
    artist: {
      type: String
    },
    composer: {
      type: String
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    playthrough: {
      type: Boolean,
      default: false
    },
    cover: {
      type: String
    }
  },
  computed: {
    artistComputed () {
      if (this.artist) return this.artist
      if ('artist' in this.mediaFile) return this.mediaFile.artist
      return ''
    },
    coverComputed () {
      if (this.cover) {
        const mediaFile = this.$store.getters['media/mediaFileByUri'](this.cover)
        return mediaFile.httpUrl
      }
      if ('previewHttpUrl' in this.mediaFile) return this.mediaFile.previewHttpUrl
      return ''
    },
    composerComputed () {
      if (this.composer) return this.composer
      if ('composer' in this.mediaFile) return this.mediaFile.composer
      return ''
    },
    slide () {
      return this.$store.getters.slideCurrent
    },
    stepNoCurrent () {
      return this.slide.renderData.stepNoCurrent - 1
    },
    titleComputed () {
      if (this.title) return this.title
      if ('title' in this.mediaFile) return this.mediaFile.title
      return ''
    },
    uriCurrent () {
      return this.src[this.stepNoCurrent]
    },
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.uriCurrent)
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
