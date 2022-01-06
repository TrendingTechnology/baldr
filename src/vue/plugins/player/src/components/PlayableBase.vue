<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { Asset, Sample } from '@bldr/media-resolver'

import { Playable } from '../playable'
import { player } from '../plugin'

@Component
export default class PlayableBaseNg extends Vue {
  @Prop({ required: true })
  src!: string | Playable | Sample | Asset

  playable!: Playable

  data () {
    return {
      playable: null
    }
  }

  private async resolvePlayable (): Promise<void> {
    if (this.src == null) {
      return
    }

    if (this.src instanceof Playable) {
      this.playable = this.src
      return
    }

    let uri: string | undefined = undefined
    if (typeof this.src === 'string') {
      uri = this.src
    } else if (this.src instanceof Sample) {
      const sample: Sample = this.src
      uri = sample.ref
    } else if (this.src instanceof Asset) {
      const asset: Asset = this.src
      uri = asset.ref
    }

    if (uri == null) {
      throw new Error(
        `The src prop must be a string, a Playable, a Sample or a Asset, got: ${this.src}`
      )
    }

    const playable = await player.resolvePlayable(uri)
    if (playable != null) {
      this.playable = playable
    }
  }

  get sample (): Sample | undefined {
    if (this.playable != null) {
      return this.playable.sample
    }
  }

  get asset (): Asset | undefined {
    if (this.playable != null) {
      return this.playable.sample.asset
    }
  }

  /**
   * The playable is connected. `this.playable` is not null.
   *
   * @abstract
   */
  playableConnected (playable: Playable): void {}

  /**
   * The playable is disconnected.
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
