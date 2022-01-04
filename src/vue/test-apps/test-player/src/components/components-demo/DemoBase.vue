<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player } from '@bldr/player'

import PlayableSelector, { eventBus } from './PlayableSelector.vue'
import { resolver, data } from '../../app'

@Component({ components: { PlayableSelector } })
export default class DemoBase extends Vue {
  src!: string

  data () {
    return {
      src: null
    }
  }

  get simpleAssets () {
    return Object.values(data)
  }

  mounted () {
    eventBus.$on('select-playable', this.listenOnPlayableSelection)
  }

  private async listenOnPlayableSelection (uuid: string) {
    await resolver.resolve(uuid)
    await player.start(uuid)
    this.src = uuid
  }
}
</script>
