<script lang="ts">
import { Component, Vue, Watch, Prop } from '@bldr/vue-packages-bundler'
import { Asset } from '@bldr/media-resolver-ng'
import { Playable } from '../../playable'

@Component
export default class PlayableBase extends Vue {
  @Prop()
  playable!: Playable

  get asset (): Asset | undefined {
    if (this.playable != null) {
      return this.playable.sample.asset
    }
  }

  registerEvents (): void {}

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
