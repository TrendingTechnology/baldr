<template>
  <div class="vc_image_master">
    <img class="img-contain" ref="image" :src="imageHttpUrl"/>
    <div
      ref="metadata"
      class="metadata"
    >
      <h1
        v-if="title && !noMeta"
        class="title font-shadow"
        v-html="title"
      />
      <p
        v-if="description && !noMeta"
        class="description font-shadow"
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
  height: 100%;
  position: relative;
  width: 100%;

  img {
    object-position: left top;
  }

  .metadata {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .description, .title {
      padding: 0 1vw;
    }
  }

  &[b-metadata-position="vertical"] {
    .metadata {
      right: 0;
      bottom: 0;
      height: 100%;
    }
  }

  &[b-metadata-position="horizontal"] {
    .metadata {
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

  &[b-metadata-position="overlay"] {
    .metadata {
      right: 0;
      bottom: 0;
      height: 40%;
      width: 100%;
      justify-content: flex-end;

      .title, .description {
        background: rgba(170, 170, 170, 0.3);
      }

      .title {
        padding-left: 5vw;
      }

      .description {
        padding: 1vw 5vw;
      }
    }
  }
}
</style>
