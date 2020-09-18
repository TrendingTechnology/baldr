<template>
  <div class="
    vc_sample_list_master_preview
    slide-preview-fullscreen
  ">
  </div>
</template>

<script>
export default {
  props: {
    previewHttpUrl: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    composer: {
      type: String
    }
  }
}
</script>

<style lang="scss">
  .vc_sample_list_master_preview {
    p {
      margin: 0;
    }

    .metadata {
      background-color: rgba(170, 170, 170, 0.6);
      bottom: 0;
      position: absolute;
      text-align: center;
      width: 100%;
    }

    .composer {
      font-size: 1.2em;
    }

    .title {
      font-size: 2em;
    }
  }
</style>
