<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player } from '@bldr/player'

import { eventBus } from '../PlayableSelector.vue'
import { resolver, data, TestAsset, TestDataCollection } from '../../app'

@Component
export default class DemoBase extends Vue {
  src!: string

  data () {
    return {
      src: null
    }
  }

  get testAssets (): TestAsset[] {
    return Object.values(data)
  }

  get testData (): TestDataCollection {
    return data
  }

  mounted () {
    eventBus.$on('select-playable', this.listenOnPlayableSelection)
  }

  private async listenOnPlayableSelection (uuid: string) {
    await resolver.resolve(uuid)
    player.load(uuid)
    // await player.start(uuid)
    this.src = uuid
  }
}
</script>
