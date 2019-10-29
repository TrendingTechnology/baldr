<template>
  <div class="vc_video_master">
    <video v-if="mediaFile" controls :src="mediaFile.httpUrl"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

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
  title: 'Video',
  icon: 'video-vintage',
  color: 'purple',
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
      props = { src: [props.src] }
    }
    return props
  },
  stepCount (props) {
    return props.src.length
  },
  resolveMediaUris (props) {
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
    ...mapGetters(['slideCurrent']),
    stepNoCurrent () {
      return this.slideCurrent.renderData.stepNoCurrent - 1
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
  .vc_video_master {
    text-align: center;
  }
</style>
