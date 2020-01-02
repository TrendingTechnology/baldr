<template>
  <div class="vc_image_master">
    <img v-if="mediaFile" :src="mediaFile.httpUrl"/>
    <div v-if="titleComputed || descriptionComputed" class="metadata">
      <h1
        v-if="!noMeta && titleComputed"
        class="title"
        v-html="titleComputed"
      />
      <p
        v-if="!noMeta && descriptionComputed"
        class="description"
        v-html="descriptionComputed"
      />
    </div>
  </div>
</template>

<script>
import { markupToHtml } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')


export default {
  computed: {
    ...mapGetters(['slideCurrent']),
    titleComputed () {
      if (this.title) return this.title
      if ('title' in this.mediaFile) return markupToHtml(this.mediaFile.title)
      return ''
    },
    descriptionComputed () {
      if (this.description) return this.description
      if ('description' in this.mediaFile) return markupToHtml(this.mediaFile.description)
      return ''
    },
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.src)
    }
  }
}
</script>

<style lang="scss" scoped>
.vc_image_master {
  font-size: 4vw;
  height: 100vh;
  position: relative;
  width: 100vw;

  img {
    bottom: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    object-fit: contain;
    position: absolute;
  }

  .metadata {
    bottom: 0;
    position: absolute;
    right: 0;
    width: 100%;
    background: rgba(170, 170, 170, 0.3);

    .title {
      font-size: 0.5em;
      text-align: center;
    }

    .description {
      font-size: 0.3em;
      padding: 1em;
    }
  }
}
</style>
