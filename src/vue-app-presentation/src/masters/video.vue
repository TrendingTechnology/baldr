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

- title: Kurzform
  video: id:Die-Geschichte-des-Jazz_Worksongs

- title: 'URL: id:'
  video:
    src: id:Die-Geschichte-des-Jazz_Worksongs

- title: 'URL: filename:'
  video:
    src: filename:Die-Geschichte-des-Jazz_Entstehung-aus-soziologischer-Sicht.mp4
`

export const master = {
  title: 'Video',
  icon: {
    name: 'video-vintage',
    color: 'purple'
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
    return [props.src]
  }
}

export default {
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Video-Datei.',
      mediaFileUri: true
    }
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.src)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_video_master {
    text-align: center;

    video {
      bottom: 0;
      height: 100vh;
      left: 0;
      object-fit: contain;
      position: absolute;
      width: 100vw;
    }
  }
</style>
