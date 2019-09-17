<template>
  <div class="video-master">
    <video v-if="mediaFile" controls :src="mediaFile.httpURL"/>
  </div>
</template>

<script>
const example = `
---
slides:

- title: 'URL: id:'
  video:
    src: id:Die-Geschichte-des-Jazz_Worksongs

- title: 'URL: filename:'
  video:
    src: filename:Die-Geschichte-des-Jazz_Entstehung-aus-soziologischer-Sicht.mp4

- title: 'Multiple video files to resolve'
  video:
  - id:Die-Geschichte-des-Jazz_Worksongs
  - filename:Die-Geschichte-des-Jazz_Entstehung-aus-soziologischer-Sicht.mp4
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
      return this.$store.getters['media/mediaFileByUri'](this.uriCurrent)
    }
  }
}
</script>

<style lang="scss" scoped>
.video-master {
  text-align: center;
}
</style>
