<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { Asset } from '@bldr/media-resolver-ng'
import { Playable } from '../playable'
import { player } from '../plugin'

@Component
export default class PlayableBase extends Vue {
  @Prop({ type: String, required: true })
  uri!: string

  get playable (): Playable {
    return player.getPlayable(this.uri)
  }

  get asset (): Asset {
    return this.playable.sample.asset
  }

  registerEvents (): void {}

  unregisterEvents (): void {}

  mounted (): void {
    this.registerEvents()
  }

  @Watch('uri')
  onUriChange (): void {
    this.unregisterEvents()
    this.registerEvents()
  }

  beforeDestroy (): void {
    this.unregisterEvents()
  }
}
</script>
