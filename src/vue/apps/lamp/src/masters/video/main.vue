<template>
  <div class="vc_video_master">
    <div class="meta-info" v-if="showMeta">
      <div class="title" v-html="title" v-if="title" />
      <div class="description small" v-html="description" v-if="description" />
    </div>
    <div id="video_master-container" />
  </div>
</template>

<script>
export default {
  props: {
    httpUrl: {
      type: String,
      required: true
    },
    previewHttpUrl: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    showMeta: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.vc_video_master {
  text-align: center;

  video {
    bottom: 0;
    height: 100%;
    left: 0;
    object-fit: contain;
    object-position: left bottom;
    position: absolute;
    width: 100%;
  }

  .meta-info {
    text-align: left;
    position: absolute;
    top: 2vw;
    left: 6vw;
    z-index: 1;
  }
}
</style>
