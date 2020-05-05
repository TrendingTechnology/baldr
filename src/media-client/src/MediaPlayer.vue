<template>
  <div class="vc_media_player" v-show="show" b-ui-theme="default">

    <div class="player-container">
      <div class="preview-container">
        <img
          class="preview-image"
          v-if="asset && asset.previewHttpUrl"
          :src="asset.previewHttpUrl"
        />
        <div
          :class="{ fullscreen: videoFullscreen }"
          v-show="asset && asset.type === 'video'"
          class="video-container"
          ref="videoContainer"
          @click="videoToggleFullscreen"
        />
      </div>

      <div class="main-area" v-if="asset">
        <!-- controls -->

        <div class="progress-area">
          <div class="progress-bar"><div ref="elapsed" class="elapsed"/></div>
          <div class="times">
            <div
              :class="{ 'current-time': true, 'enlarged': isCurTimeEnlarged }"
              @click="toggleCurTimeSize"
            >
              {{ currentTime }}
            </div>
            <!-- controls -->

            <div class="controls">
              <material-icon
                name="skip-previous"
                @click.native="$media.playList.startPrevious()"
              />
              <material-icon
                v-if="paused"
                name="play"
                @click.native="$media.player.start()"
              />
              <material-icon
                v-if="!paused"
                name="pause"
                @click.native="$media.player.pause()"
              />
              <material-icon
                name="skip-next"
                @click.native="$media.playList.startNext()"
              />
              <material-icon
                name="fullscreen"
                @click.native="videoToggleFullscreen"
              />
            </div>

            <div class="duration">{{ duration }}</div>
          </div>
        </div>

        <!-- meta-data -->

        <div class="meta-data">
          {{ no }}. {{ samplePlaying.title }} ({{ asset.titleSafe }})
        </div>

      </div>
      <p v-else>Es ist keine Medien-Datei geladen.</p>
      <div class="placeholder"></div>
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
import { MaterialIcon } from '@bldr/icons'
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
      currentTimeSec: 0,
      duration: 0,
      durationSec: 0,
      paused: true,
      videoElement: null,
      videoFullscreen: false,
      isCurTimeEnlarged: false
    }
  },
  computed: {
    samplePlaying () {
      return this.$store.getters['media/samplePlayListCurrent']
    },
    asset () {
      if (this.samplePlaying) return this.samplePlaying.asset
    },
    mediaElement () {
      if (this.samplePlaying) return this.samplePlaying.mediaElement
    },
    no () {
      return this.$store.getters['media/playListNoCurrent']
    }
  },
  watch: {
    mediaElement () {
      this.mediaElement.ontimeupdate = (event) => {
        this.currentTimeSec = event.target.currentTime
        this.currentTime = formatDuration(event.target.currentTime)
      }
      this.mediaElement.oncanplaythrough = (event) => {
        this.durationSec = event.target.duration
        this.duration = formatDuration(event.target.duration)
      }
      this.mediaElement.onplay = (event) => {
        this.paused = false
      }
      this.mediaElement.onpause = (event) => {
        this.paused = true
      }
      if (this.videoElement) this.videoElement.style.display = 'none'
      if (this.asset.type === 'video') {
        // Make a canvas clone see https://stackoverflow.com/a/24532111/10193818
        //this.mediaElement.style.display = 'block'
        //this.$refs.videoContainer.appendChild(this.mediaElement)
        //this.videoElement = this.mediaElement
      }
    },
    currentTimeSec (value) {
      const progress = (this.currentTimeSec / this.durationSec) * 100
      if (progress) {
        this.$refs.elapsed.style.width = `${progress}%`
      } else {
        this.$refs.elapsed.style.width = '0%'
      }
    }
  },
  methods: {
    toggle: function () {
      this.show = !this.show
    },
    videoToggleFullscreen: function () {
      this.videoFullscreen = !this.videoFullscreen
    },
    toggleCurTimeSize: function () {
      this.isCurTimeEnlarged = !this.isCurTimeEnlarged
    }
  },
  mounted: function () {
    // Show the media player.
    this.$shortcuts.add('ctrl+alt+m', () => { this.toggle() }, 'Zeige den Medien-Abspieler')
  }
}
</script>

<style lang="scss">
  $preview-size: 8vw;
  $padding: 0.4vw;

  .vc_media_player {
    background-color: $gray;
    bottom: 0;
    color: $black;
    left: 0;
    padding: 0.4vw;
    position: fixed;
    text-align: left;
    width: 100%;
    z-index: 1;

    .duration, .current-time {
      font-family: sans;
    }

    .current-time.enlarged {
      font-size: 3em;
    }

    .player-container {
      display: flex;
    }

    .meta-data {
    }

    .main-area {
      width: 100%;
      margin-left: $padding;
    }



    .progress-bar {
      width: 100%;
      background-color: $black;
      height: 1vh;
    }

    .elapsed {
      background: $orange;
      width: 0%;
      height: 100%;
    }

    .times {
      display: flex;
      justify-content: space-between;
    }

    .placeholder {
      width: 6vw;
    }

    .preview-container {
      height: $preview-size;
    }

    .preview-image {
      height: $preview-size;
      object-fit: cover;
      width: $preview-size;
    }

    .preview-image, .video-container {
      background-color: $black;
    }

    .video-container {
      height: $preview-size;
      width: $preview-size;

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

    .close {
      position: absolute;
      right: 1em;
      top: 0.5em;
    }
  }
</style>
