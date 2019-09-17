<template>
  <div class="audio-master">
    <img
      :src="mediaFile.previewHttpUrl"
      class="preview"
      v-if="mediaFile.previewHttpUrl"
    />

    <p>
      <audio controls :src="srcResolved"/>
    </p>

    <p
      class="title piece"
      v-if="mediaFile.title"
    >{{ mediaFile.title }}</p>
    <p
      class="artist person"
      v-if="mediaFile.artist"
    >{{ mediaFile.artist }}</p>
  </div>
</template>

<script>
const example = `
---
slides:

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
      data = { src: [data.src] }
    }
    return data
  },
  stepCount (data) {
    return data.src.length
  },
  mediaURIs (props) {
    return props.src
  }
}

export default {
  props: {
    src: {
      type: [String, Array],
      required: true
    }
  },
  asyncComputed: {
    srcResolved () {
      return this.$resolveHttpURL(this.uriCurrent)
    }
  },
  computed: {
    slide () {
      return this.$store.getters.slideCurrent
    },
    stepNoCurrent () {
      return this.slide.master.stepNoCurrent - 1
    },
    uriCurrent () {
      return this.src[this.stepNoCurrent]
    },
    mediaFile () {
      if (this.uriCurrent in this.$store.getters['media/media']) {
        return this.$store.getters['media/media'][this.uriCurrent]
      }
      return {}
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
