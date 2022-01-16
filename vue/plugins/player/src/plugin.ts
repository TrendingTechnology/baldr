import _Vue from 'vue'

import { Resolver } from '@bldr/media-resolver'

import { Player } from './player'

export { default as ControlButtons } from './components/ControlButtons.vue'

import HorizontalPlayButtons from './components/HorizontalPlayButtons.vue'
export { default as HorizontalPlayButtons } from './components/HorizontalPlayButtons.vue'

import MediaPlayer from './components/MediaPlayer.vue'
export { default as MediaPlayer } from './components/MediaPlayer.vue'

import PlayableText from './components/PlayableText.vue'
export { default as PlayableText } from './components/PlayableText.vue'

import PlayButton from './components/PlayButton.vue'
export { default as PlayButton } from './components/PlayButton.vue'

export { default as ProgressBar } from './components/ProgressBar.vue'

import WaveForm from './components/WaveForm.vue'
export { default as WaveForm } from './components/WaveForm.vue'

import VideoScreen from './components/VideoScreen.vue'
export { default as VideoScreen } from './components/VideoScreen.vue'

export { Playable } from './playable'

export let player: Player

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default {
  install (Vue: typeof _Vue, resolver: Resolver): void {
    player = new Player(resolver)
    Vue.component('horizontal-play-buttons', HorizontalPlayButtons)
    Vue.component('media-player', MediaPlayer)
    Vue.component('play-button', PlayButton)
    Vue.component('playable-text', PlayableText)
    Vue.component('video-screen', VideoScreen)
    Vue.component('wave-form', WaveForm)
  }
}
