<template>
  <div class="media-player" v-show="show">
    <div v-if="mediaFile">
      <img v-if="mediaFile.previewHttpUrl" :src="mediaFile.previewHttpUrl"/>
      {{ mediaFile.titleSafe }}
      {{ currentTime }} /
      {{ duration }}
      <div ref="videoContainer"></div>
    </div>

    <p v-else>No media file loaded</p>

    <material-icon
      class="close"
      name="close"
      @click.native="toggle"
    />
  </div>
</template>

<script>
/* globals compilationTime gitHead */
import { MaterialIcon } from '@bldr/vue-component-material-icon'
import { formatDuration } from './index.js'

export default {
  name: 'MediaPlayer',
  components: {
    MaterialIcon
  },
  data () {
    return {
      show: false,
      currentTime: 0,
      duration: 0,
      videoElement: null
    }
  },
  computed: {
    mediaFile () {
      return this.$store.getters['media/current']
    },
    mediaElement () {
      if (this.mediaFile) return this.mediaFile.mediaElement
    }
  },
  watch: {
    mediaElement () {
      this.mediaElement.ontimeupdate = (event) => {
        this.currentTime = formatDuration(event.target.currentTime)
      }
      this.mediaElement.oncanplaythrough = (event) => {
        this.duration = formatDuration(event.target.duration)
      }
      if (this.videoElement) this.$refs.videoContainer.removeChild(this.videoElement)
      if (this.mediaFile.type === 'video') {
        this.$refs.videoContainer.appendChild(this.mediaElement)
        this.videoElement = this.mediaElement
      }
    }
  },
  methods: {
    toggle: function () {
      this.show = !this.show
    }
  },
  mounted: function () {
    this.$shortcuts.add('m s', () => { this.toggle() }, 'Show the media player.')
  }
}



</script>

<style lang="scss" scoped>
  .media-player {
    bottom: 0;
    background-color: $white;
    box-sizing: border-box;
    left: 0;
    padding: 0.4vw;
    position: absolute;
    text-align: left;
    width: 100%;
    color: $black;

    .close {
      position: absolute;
      top: 0.5em;
      right: 1em;
    }
  }
</style>
