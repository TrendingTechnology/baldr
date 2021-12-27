<template>
  <div class="vc_image_master">
    <img class="img-contain" ref="image" :src="imageHttpUrl" />
    <div ref="metadata" class="metadata">
      <h1 v-if="title && !noMeta" class="title font-shadow" v-html="title" />
      <p
        v-if="descriptionTeaser && !showLongDescription && !noMeta"
        class="description-teaser font-shadow"
        v-html="descriptionTeaser"
      />
      <span v-if="isLongDescription" @click="toggleDescription()">…</span>
      <p
        v-if="description && showLongDescription && !noMeta"
        class="description font-shadow"
        v-html="description"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

@Component
export default class ImageMasterMain extends MasterMain {
  masterName = 'image'

  @Prop({
    type: String
  })
  imageHttpUrl: string

  @Prop({
    type: String
  })
  title: string

  @Prop({
    type: String
  })
  description: string

  @Prop({
    type: String
  })
  descriptionTeaser: string

  @Prop({
    type: Boolean
  })
  isLongDescription: string

  @Prop({
    type: Boolean
  })
  noMeta: boolean

  showLongDescription: boolean

  data () {
    return {
      showLongDescription: false
    }
  }

  toggleDescription () {
    this.showLongDescription = !this.showLongDescription
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

    .description,
    .description-teaser,
    .title {
      padding: 0 1vw;
      margin: 0;
    }
  }

  &[b-metadata-position='vertical'] {
    .metadata {
      right: 0;
      bottom: 0;
      height: 100%;
    }
  }

  &[b-metadata-position='horizontal'] {
    .metadata {
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

  &[b-metadata-position='overlay'] {
    .metadata {
      right: 0;
      bottom: 0;
      height: 40%;
      width: 100%;
      justify-content: flex-end;

      .title,
      .description,
      .description-teaser {
        background: rgba(170, 170, 170, 0.3);
      }

      .title {
        padding-left: 5vw;
      }

      .description,
      .description-teaser {
        padding: 0.5vw 5vw;
      }
    }
  }
}
</style>
