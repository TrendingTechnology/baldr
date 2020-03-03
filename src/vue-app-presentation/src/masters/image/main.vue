<template>
  <div class="vc_image_master">
    <img :src="imageHttpUrl"/>
    <div
      v-if="!noMeta && (title || description)"
      class="metadata"
    >
      <h1
        v-if="title"
        class="title"
        v-html="title"
      />
      <p
        v-if="description"
        class="description"
        v-html="description"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageHttpUrl: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    noMeta: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
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
