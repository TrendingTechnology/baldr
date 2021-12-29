import _Vue from 'vue'

import { Resolver } from '@bldr/media-resolver-ng'

import { Player } from './player'

import MediaPlayer from './components/MediaPlayer.vue'
export { default as MediaPlayer } from './components/MediaPlayer.vue'

import PlayButton from './components/PlayButton.vue'
export { default as PlayButton } from './components/PlayButton.vue'

export { default as ProgressBar } from './components/ProgressBar.vue'
export { default as WaveForm } from './components/WaveForm.vue'

export { Playable } from './playable'

export let player: Player

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default {
  install (Vue: typeof _Vue, resolver: Resolver): void {
    player = new Player(resolver)
    Vue.component('play-button-ng', PlayButton)
    Vue.component('media-player-ng', MediaPlayer)
  }
}
