import { VueAlias } from '@bldr/vue-packages-bundler'
import { Resolver } from '@bldr/media-resolver-ng'

import { Player } from './player'
import PlayButton from './components/plugin/PlayButton.vue'
import MediaPlayerNg from './components/plugin/MediaPlayerNg.vue'

export let player: Player

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default {
  install (Vue: typeof VueAlias, resolver: Resolver): void {
    player = new Player(resolver)
    Vue.component('play-button-ng', PlayButton)
    Vue.component('media-player-ng', MediaPlayerNg)
  }
}
