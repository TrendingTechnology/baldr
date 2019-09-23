<template>
  <div class="media-player" v-show="show">

    <div class="player-container">
      <div class="preview-container">
        <img
          class="preview-image"
          v-if="mediaFile && mediaFile.previewHttpUrl"
          :src="mediaFile.previewHttpUrl"
        />
        <div
          :class="{ fullscreen: videoFullscreen }"
          v-show="mediaFile && mediaFile.type === 'video'"
          class="video-container"
          ref="videoContainer"
          @click="videoToggleFullscreen"
        />
      </div>

      <div class="meta-data" v-if="mediaFile">
        {{ mediaFile.titleSafe }}
        {{ currentTime }} /
        {{ duration }}
        <material-icon name="skip-previous"/>
        <material-icon name="play" @click.native="$media.player.play()"/>
        <material-icon name="pause" @click.native="$media.player.pause()"/>
        <material-icon name="skip-next"/>
        <material-icon name="fullscreen" @click.native="videoToggleFullscreen"/>
      </div>
      <p v-else>No media file loaded</p>
    </div>

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
      videoElement: null,
      videoFullscreen: false
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
      if (this.videoElement) this.videoElement.style.display = 'none'
      if (this.mediaFile.type === 'video') {
        this.mediaElement.style.display = 'block'
        this.$refs.videoContainer.appendChild(this.mediaElement)
        this.videoElement = this.mediaElement
      }
    }
  },
  methods: {
    toggle: function () {
      this.show = !this.show
    },
    videoToggleFullscreen: function () {
      this.videoFullscreen = !this.videoFullscreen
    }
  },
  mounted: function () {
    this.$shortcuts.add('m s', () => { this.toggle() }, 'Show the media player.')
  }
}
</script>

<style lang="scss" scoped>
  $preview-size: 8vw;

  .media-player {
    bottom: 0;
    background-color: scale-color(rgba($gray, 0.7), $alpha: 10%);
    left: 0;
    padding: 0.4vw;
    position: fixed;
    text-align: left;
    width: 100%;
    color: $black;

    .player-container {
      display: flex;
    }

    .meta-data {
      padding: 1em;
    }

    .preview-image {
      width: $preview-size;
      height: $preview-size;
      object-fit: cover;
    }

    .video-container {
      width: $preview-size;
      height: $preview-size;
    }

    .preview-image, .video-container {
      background-color: $black;
    }

    .close {
      position: absolute;
      top: 0.5em;
      right: 1em;
    }
  }
</style>

<style lang="scss">
  $preview-size: 8vw;

  .media-player {
    .video-container {
      video {
        width: $preview-size;
        height: $preview-size;
        object-fit: contain;
      }
      &.fullscreen {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
</style>
