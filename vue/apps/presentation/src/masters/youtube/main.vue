<template>
  <div class="vc_youtube_master main-app-padding">
    <div class="source smaller">
      <span class="important">Quelle:</span>
      <a :href="`https://www.youtube.com/watch?v=${youtubeId}`" target="_blank">
        youtu.be/{{ youtubeId }}
      </a>
    </div>

    <h1 class="heading" v-if="heading" v-html="heading" />

    <iframe
      :src="`https://www.youtube.com/embed/${youtubeId}`"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      frameborder="0"
      v-if="!asset"
    />
    <video-screen v-if="uri" :src="uri" id="youtube-offline-video" />
    <p class="small" v-if="info" v-html="info" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset, youtubeMModule } from '@bldr/presentation-parser'
import { player } from '@bldr/player'

import MasterMain from '../MasterMain.vue'

@Component
export default class YoutubeMasterMain extends MasterMain {
  masterName = 'youtube'

  @Prop({
    type: Object
  })
  asset?: Asset

  @Prop({
    type: String,
    required: true
  })
  youtubeId!: string

  @Prop({
    type: String
  })
  heading?: string

  @Prop({
    type: String
  })
  info?: string

  get uri (): string | undefined {
    if (this.asset != null) {
      return youtubeMModule.convertYoutubeIdToUri(this.youtubeId)
    }
  }

  async afterSlideNoChange (): Promise<void> {
    if (!this.isPublic) {
      return
    }

    if (this.asset != null && this.uri != null) {
      player.load(this.uri)
    }
  }
}
</script>

<style lang="scss">
.vc_youtube_master {
  .heading,
  #youtube-offline-video {
    text-align: center;
  }

  iframe {
    width: 75%;
    height: 75%;
  }

  #youtube-offline-video {
    video {
      height: 10em;
      width: 10em;
    }
  }

  .source {
    position: absolute;
    top: 1.4vmin;
    left: 8vmin;
  }
}
</style>
