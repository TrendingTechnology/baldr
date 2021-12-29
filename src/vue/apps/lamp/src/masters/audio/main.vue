<template>
  <div class="vc_audio_master main-app-padding big">
    <p class="description" v-if="description" v-html="description" />

    <img :src="previewHttpUrl" class="preview" v-if="previewHttpUrl" />

    <p class="composer person" v-if="composer" v-html="composer" />
    <p class="title piece" v-if="partOf" v-html="partOf" />
    <p class="title piece" v-if="title" v-html="title" />
    <p class="artist person" v-if="artist" v-html="artist" />

    <wave-form-ng :playable="playable" />
    <!-- <wave-form :sample="sample" /> -->

    <play-button-ng class="left-bottom-corner" :playable="playable" />
    <!-- <play-button class="left-bottom-corner" :sample="sample" /> -->
    <external-sites :asset="mediaAsset" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { media } from '@bldr/media-client'
import { player, Playable } from '@bldr/player'
import { Sample, Asset } from '@bldr/presentation-parser'

import MasterMain from '../MasterMain.vue'
import ExternalSites from '@/components/reusable/ExternalSites.vue'

@Component({
  components: {
    ExternalSites
  }
})
export default class AudioMasterMain extends MasterMain {
  masterName = 'audio'

  @Prop({
    type: String
  })
  previewHttpUrl: string

  @Prop({
    type: Object
  })
  sample: Sample

  @Prop({
    type: Object
  })
  mediaAsset: Asset

  @Prop({
    type: String,
    required: true
  })
  title: string

  @Prop({
    type: String
  })
  composer: string

  @Prop({
    type: String
  })
  artist: string

  @Prop({
    type: String
  })
  partOf: string

  @Prop({
    type: String
  })
  description: string

  get playable (): Playable {
    return player.getPlayable(this.slide.props.src)
  }

  async afterSlideNoChange (): Promise<void> {
    if (!this.isPublic) {
      return
    }
    media.player.load(this.slide.props.src)
    if (this.slide.props.autoplay) {
      await media.player.start()
    }
  }
}
</script>

<style lang="scss">
.vc_audio_master {
  text-align: center;

  p {
    margin: 0;
  }

  .composer {
    font-size: 1.2em;
  }

  .title {
    font-size: 1.1em;
  }

  .artist {
    font-size: 0.7em;
  }

  img.preview {
    height: 10em;
    width: 10em;
    object-fit: cover;
  }

  .vc_wave_form {
    text-align: center;
    margin: 0 auto;
  }

  .description {
    font-size: 0.6em;
    padding-bottom: 2em;
  }
}
</style>
