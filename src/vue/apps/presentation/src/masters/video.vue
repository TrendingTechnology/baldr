<template>
  <div class="video-master">
    <video controls :src="srcResolved"/>
  </div>
</template>

<script>
const example = `
---
slides:

- title: 'URL: id:'
  video:
    src: id:Du-bist-als-Kind-zu-heiss-gebadet-worden

- title: 'URL: filename:'
  video:
    src: filename:Ich-hab-zu-Haus-ein-Grammophon.m4a

- title: 'Multiple video files to resolve'
  video:
  - id:Du-bist-als-Kind-zu-heiss-gebadet-worden
  - filename:Ich-hab-zu-Haus-ein-Grammophon.m4a
`

export const master = {
  centerVertically: true,
  darkMode: true,
  slidePadding: 0,
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
      return this.$store.getters.media[this.uriCurrent]
    }
  }
}
</script>

<style lang="scss" scoped>
.video-master {
  text-align: center;
}
</style>
