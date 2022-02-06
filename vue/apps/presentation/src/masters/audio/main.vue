<template>
  <div class="vc_audio_master main-app-padding">
    <p class="description" v-if="description" v-html="description" />

    <img :src="previewHttpUrl" class="preview" v-if="previewHttpUrl" />

    <p class="first-participant person" v-if="firstParticipant" v-html="firstParticipant" />
    <p class="title piece" v-if="partOf" v-html="partOf" />
    <p class="title piece" v-if="title" v-html="title" />
    <p class="second-participant person" v-if="secondParticipant" v-html="secondParticipant" />

    <wave-form :src="uri" />

    <play-button class="left-bottom-corner" :src="uri" />
    <external-sites :asset="mediaAsset" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

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
  previewHttpUrl!: string

  @Prop({
    type: Object
  })
  sample!: Sample

  @Prop({
    type: Object
  })
  mediaAsset!: Asset

  @Prop({
    type: String,
    required: true
  })
  title!: string

  @Prop({
    type: String
  })
  composer!: string

  @Prop({
    type: String
  })
  artist!: string

  @Prop({
    type: String
  })
  partOf!: string

  @Prop({
    type: String
  })
  description!: string

  @Prop({
    type: Boolean
  })
  isClassical!: boolean

  get uri (): string {
    return this.slide.props.src
  }

  get playable (): Playable {
    return player.getPlayable(this.slide.props.src)
  }

  get firstParticipant (): string | undefined {
    if (this.composer == null && this.artist != null) {
      return this.artist
    } else if (this.composer != null && this.artist == null) {
      return this.composer
    } else if (this.isClassical) {
      return this.composer
    } else {
      return this.artist
    }
  }

  get secondParticipant (): string | undefined {
    if (
      this.composer != null &&
      this.artist != null &&
      this.composer !== this.artist
    ) {
      if (this.isClassical) {
        return this.artist
      } else {
        return this.composer
      }
    }
  }

  async afterSlideNoChange (): Promise<void> {
    if (!this.isPublic) {
      return
    }
    player.load(this.slide.props.src)
    if (this.slide.props.autoplay) {
      await player.start()
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

  .first-participant {
    font-size: 1.2em;
  }

  .title {
    font-size: 1.1em;
  }

  .second-participant {
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
