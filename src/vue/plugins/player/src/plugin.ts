import _Vue from 'vue'

import { Resolver } from '@bldr/media-resolver-ng'

import { Player } from './player'
import PlayButton from './components/plugin/PlayButton.vue'
import MediaPlayer from './components/plugin/MediaPlayer.vue'

export let player: Player

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default {
  install (Vue: typeof _Vue, resolver: Resolver): void {
    player = new Player(resolver)
    Vue.component('play-button-ng', PlayButton)
    Vue.component('media-player-ng', MediaPlayer)
  }
}
