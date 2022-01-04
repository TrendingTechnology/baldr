<template>
  <div class="vc_horizontal_play_buttons">
    <span v-for="wrappedUri in wrappedUris" :key="wrappedUri.uri">
      <play-button :src="wrappedUri.uri" />
      <span
        class="manual-title sans"
        v-html="wrappedUri.title"
        v-if="showTitles && wrappedUri.title != null"
      />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { WrappedUriList, FuzzyUriInput } from '@bldr/client-media-models'

import { player } from '../plugin'

import PlayButton from './PlayButton.vue'

@Component({
  components: {
    PlayButton
  }
})
export default class HorizontalPlayButtons extends Vue {
  @Prop({
    required: true
  })
  src!: FuzzyUriInput

  @Prop({
    type: Boolean,
    default: true
  })
  showTitles!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  loadFirst!: boolean

  get wrappedUris (): WrappedUriList {
    return new WrappedUriList(this.src)
  }

  mounted () {
    this.loadSample()
  }

  private loadSample (): void {
    if (this.loadFirst && this.wrappedUris.first != null) {
      player.load(this.wrappedUris.first.uri)
    }
  }
}
</script>

<style lang="scss">
.vc_horizontal_play_buttons {
  .manual-title {
    padding: 0 0.5em;
    transform: translateY(-0.2em);
    display: inline-block;
  }
}
</style>
