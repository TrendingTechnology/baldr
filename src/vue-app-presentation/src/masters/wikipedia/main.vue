<template>
  <div class="vc_wikipedia_master">
    <p class="title">Wikipedia-Artikel: {{ title }} ({{ httpUrl }})</p>
    <div class="iframe-wrapper">
      <iframe
        :src="iframeHttpUrl"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    httpUrl: {
      type: String,
      required: true,
    },
    iframeHttpUrl: {
      type: String,
      required: true,
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_wikipedia_master {
    .title {
      margin-left: 10vw;
    }

    .iframe-wrapper {
      text-align: center;

      iframe {
        background-color: white;
        border: 1px solid scale-color($gray, $lightness: 30%);
        height: 95vh;
        padding: 1vw;
        width: 70vw;
      }
    }
  }
</style>
