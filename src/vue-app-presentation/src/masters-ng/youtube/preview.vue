<template>
  <div class="vc_youtube_master_preview slide-preview-wrapper">
    <img :src="httpUrl" class="image-contain"/>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * https://stackoverflow.com/a/55890696/10193818
     *
     * Low quality
     * https://img.youtube.com/vi/[video-id]/sddefault.jpg
     *
     * medium quality
     * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
     *
     * High quality
     * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
     *
     * maximum resolution
     * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
     */
    httpUrl () {
      return `http://img.youtube.com/vi/${this.id}/hqdefault.jpg`
    }
  }
}
</script>
