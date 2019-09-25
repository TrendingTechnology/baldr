<template>
  <div v-if="mediaFile" class="audio-master">
    <img
      :src="coverComputed"
      class="preview"
      v-if="coverComputed"
    />

    <p>
      <audio controls :src="mediaFile.httpUrl"/>
    </p>

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
  styleConfig: {
    centerVertically: true,
    darkMode: true,
    slidePadding: 0
  },
  example,
  normalizeData (data) {
    if (typeof data === 'string' || Array.isArray(data)) {
      data = { src: data }
    }
    if (typeof data.src === 'string') {
      data.src = [data.src]
    }
    return data
  },
  stepCount (data) {
    return data.src.length
  },
  mediaUris (props) {
    const uris = props.src
    if (props.cover) uris.push(props.cover)
    return uris
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
    autoplay: {
      type: Boolean,
      default: true
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
    slide () {
      return this.$store.getters.slideCurrent
    },
    stepNoCurrent () {
      return this.slide.master.stepNoCurrent - 1
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
.audio-master {
  text-align: center;

  .artist {
    font-size: 0.9em;
  }

  .title {
    font-size: 1.1em;
  }

  img.preview {
    height: 30vh;
    width: 30vh;
    object-fit: cover;
  }
}
</style>
