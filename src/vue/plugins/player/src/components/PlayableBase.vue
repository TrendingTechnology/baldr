<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { Asset } from '@bldr/media-resolver-ng'
import { Playable } from '../playable'

@Component
export default class PlayableBase extends Vue {
  @Prop()
  playable!: Playable

  get asset (): Asset | undefined {
    if (this.playable != null) {
      return this.playable.sample.asset
    }
  }

  /**
   * The playable is set
   */
  registerEvents (): void {}

  /**
   * The playable is removed.
   */
  unregisterEvents (): void {}

  mounted (): void {
    this.registerEvents()
  }

  @Watch('playable')
  onPlayableChange (): void {
    this.unregisterEvents()
    this.registerEvents()
  }

  beforeDestroy (): void {
    this.unregisterEvents()
  }
}
</script>
