<template>
  <play-button
    class="vc_resolveable_play_button"
    v-if="playable"
    :playable="playable"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { Playable } from '../playable'
import { player } from '../plugin'

import PlayButton from './PlayButton.vue'

@Component({
  components: {
    PlayButton
  }
})
export default class ResolveablePlayButton extends Vue {
  @Prop({ type: String })
  uri!: string

  playable!: Playable

  data () {
    return {
      playable: null
    }
  }

  async resolvePlayable (): Promise<void> {
    if (this.uri != null) {
      const playable = await player.resolvePlayable(this.uri)
      if (playable != null) {
        this.playable = playable
      }
    }
  }

  @Watch('uri')
  onUriChange () {
    this.resolvePlayable()
  }

  mounted () {
    this.resolvePlayable()
  }
}
</script>
