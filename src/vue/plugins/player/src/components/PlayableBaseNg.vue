<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { Asset, Sample } from '@bldr/media-resolver-ng'
import { Playable } from '../playable'

import { player } from '../plugin'

@Component
export default class PlayableBaseNg extends Vue {
  @Prop()
  src!: string | Playable | Asset | Sample

  playable!: Playable

  data () {
    return {
      playable: null
    }
  }

  private async resolvePlayable (): Promise<void> {
    if (this.src != null) {
      if (typeof this.src === 'string') {
        const playable = await player.resolvePlayable(this.src)
        if (playable != null) {
          this.playable = playable
        }
      } else if (this.src instanceof Playable) {
        this.playable = this.src
      }
    }
  }

  get asset (): Asset | undefined {
    if (this.playable != null) {
      return this.playable.sample.asset
    }
  }

  /**
   * The playable is connected
   *
   * @abstract
   */
  playableConnected (playable: Playable): void {}

  /**
   * The playable is removed.
   *
   * @abstract
   */
  playableDisconnected (): void {}

  mounted (): void {
    this.resolvePlayable().catch(reason => {
      console.log(reason)
    })
    if (this.playable != null) {
      this.playableConnected(this.playable)
    }
  }

  @Watch('src')
  onSrcChange (): void {
    this.resolvePlayable().catch(reason => {
      console.log(reason)
    })
  }

  @Watch('playable')
  onPlayableChange (): void {
    this.playableDisconnected()
    if (this.playable != null) {
      this.playableConnected(this.playable)
    }
  }

  beforeDestroy (): void {
    this.playableDisconnected()
  }
}
</script>
