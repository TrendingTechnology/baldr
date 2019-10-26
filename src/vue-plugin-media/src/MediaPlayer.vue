<template>
  <div class="vc_media_player" v-show="show" b-ui-theme="default">

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
        <material-icon
          name="skip-previous"
          @click.native="$media.player.startPrevious()"
        />
        <material-icon
          v-if="paused"
          name="play"
          @click.native="$media.player.play()"
        />
        <material-icon
          v-if="!paused"
          name="pause"
          @click.native="$media.player.pause()"
        />
        <material-icon
          name="skip-next"
          @click.native="$media.player.startNext()"
        />
        <material-icon
          name="fullscreen"
          @click.native="videoToggleFullscreen"
        />
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
import { MaterialIcon } from '@bldr/vue-plugin-material-icon'
import { formatDuration } from './main.js'

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
      paused: true,
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
      this.mediaElement.onplay = (event) => {
        this.paused = false
      }
      this.mediaElement.onpause = (event) => {
        this.paused = true
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

  .vc_media_player {
    background-color: scale-color(rgba($gray, 0.7), $alpha: 10%);
    bottom: 0;
    color: $black;
    left: 0;
    padding: 0.4vw;
    position: fixed;
    text-align: left;
    width: 100%;

    .player-container {
      display: flex;
    }

    .meta-data {
      padding: 1em;
    }

    .preview-image {
      height: $preview-size;
      object-fit: cover;
      width: $preview-size;
    }

    .video-container {
      height: $preview-size;
      width: $preview-size;
    }

    .preview-image, .video-container {
      background-color: $black;
    }

    .close {
      position: absolute;
      right: 1em;
      top: 0.5em;
    }
  }
</style>

<style lang="scss">
  $preview-size: 8vw;

  .vc_media_player {
    .video-container {
      video {
        height: $preview-size;
        object-fit: contain;
        width: $preview-size;
      }

      &.fullscreen {
        height: 100vh;
        left: 0;
        position: fixed;
        top: 0;
        width: 100vw;

        video {
          height: 100%;
          object-fit: contain;
          width: 100%;
        }
      }
    }
  }
</style>
