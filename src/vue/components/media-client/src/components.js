import MediaPlayer from './MediaPlayer.vue'
import HorizontalPlayButtons from './HorizontalPlayButtons.vue'
import MediaCanvas from './MediaCanvas.vue'
import PlayButton from './PlayButton.vue'
import WaveForm from './WaveForm.vue'

export function registerComponents (Vue) {
  Vue.component('media-player', MediaPlayer)
  Vue.component('horizontal-play-buttons', HorizontalPlayButtons)
  Vue.component('play-button', PlayButton)
  Vue.component('media-canvas', MediaCanvas)
  Vue.component('wave-form', WaveForm)

}
