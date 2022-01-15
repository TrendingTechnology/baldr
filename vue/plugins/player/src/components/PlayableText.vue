<template>
  <span
    class="vc_playable_text"
    @click="actByStatus"
    v-if="playable"
    ><plain-icon :name="iconName" />{{ title }}</span
  >
</template>

<script lang="ts">
import Component from 'vue-class-component'

import { PlainIcon } from '@bldr/icons'
import { player } from '../plugin'

import PlayableBase from './PlayableBase.vue'

@Component({
  components: {
    PlainIcon
  }
})
export default class PlayableText extends PlayableBase {
  get title (): string | undefined {
    if (this.playable == null) {
      return
    }
    if (this.playable.sample.shortcut) {
      return `${this.playable.sample.titleSafe} [${this.playable.sample.shortcut}]`
    }
    return this.playable.sample.titleSafe
  }

  get iconName(): 'play' | 'stop' {
    if (this.playable.isPlaying) {
      return 'stop'
    }
    return 'play'
  }

  async actByStatus (): Promise<void> {
    if (this.playable == null) {
      return
    }
    if (this.playable.playbackState !== 'stopped') {
      player.stop()
    } else {
      await player.start({ uri: this.playable.sample.ref })
    }
  }
}
</script>

<style lang="scss">
.vc_playable_text {
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
}
</style>
