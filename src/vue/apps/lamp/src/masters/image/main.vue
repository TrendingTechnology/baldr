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

  $refs!: {
    image: HTMLImageElement
    metadata: HTMLDivElement
  }

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

  data (): { showLongDescription: boolean } {
    return {
      showLongDescription: false
    }
  }

  toggleDescription (): void {
    this.showLongDescription = !this.showLongDescription
  }

  afterSlideNoChange (): void {
    // This variable indicates if in the prop description is a lot of text.
    let lotOfText = false
    if (
      this.slide.propsMain.description &&
      this.slide.propsMain.description.length > 400
    ) {
      lotOfText = true
    }

    function resetMetadataStyle (metaStyle: CSSStyleDeclaration): void {
      metaStyle.width = null
      if (!lotOfText) {
        metaStyle.fontSize = null
      } else {
        metaStyle.fontSize = '0.8em'
      }
      metaStyle.height = null
    }

    if (this.$refs.image) {
      const img = this.$refs.image

      // aspectRatio > 1 = 'landscape'
      // aspectRatio < 1 = 'protrait'
      const imgAspectRatio = img.naturalWidth / img.naturalHeight
      const frameAspectRatio = this.$el.clientWidth / this.$el.clientHeight
      // vertical // left / right free space > 1
      // horicontal // top / bottom free space < 1
      const freeSpaceRatio = frameAspectRatio / imgAspectRatio

      var scale = Math.min(
        this.$el.clientWidth / img.naturalWidth,
        this.$el.clientHeight / img.naturalHeight
      )

      const metaStyle = this.$refs.metadata.style

      const overlayZone = 0.3
      // vertical
      if (freeSpaceRatio > 1 + overlayZone) {
        this.$el.setAttribute('b-metadata-position', 'vertical')
        const width = this.$el.clientWidth - img.naturalWidth * scale
        resetMetadataStyle(metaStyle)
        metaStyle.width = `${width}px`
        // horizontal
      } else if (freeSpaceRatio < 1 - overlayZone) {
        this.$el.setAttribute('b-metadata-position', 'horizontal')
        const height = this.$el.clientHeight - img.naturalHeight * scale
        resetMetadataStyle(metaStyle)
        metaStyle.height = `${height}px`
        // overlay
      } else {
        resetMetadataStyle(metaStyle)
        this.$el.setAttribute('b-metadata-position', 'overlay')
        // Metadata box which extends to more than 40 percent of the screen.
        if (this.$refs.metadata.clientHeight / this.$el.clientHeight > 0.3) {
          metaStyle.fontSize = '0.7em'
        }
      }
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
