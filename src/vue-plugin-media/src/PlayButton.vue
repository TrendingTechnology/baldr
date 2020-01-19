<template>
  <div class="vc_play_button" :class="status" @click="actByStatus">
    <svg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(125,125)">
        <circle r="100" class="circle-base"/>
        <g transform="rotate(-90)">
          <circle r="100" ref="progress" class="circle-progress"/>
        </g>
      </g>
    </svg>
    <div class="icons">
      <plain-icon
        v-if="status === 'starting'"
        name="play-speed"
        class="baldr-icon-spin"
      />
      <plain-icon
        v-if="status === 'fadein'"
        name="fadeout"
        class="spin-clockwise"
      />
      <plain-icon
        v-if="status === 'stopped'"
        name="play"
      />
      <plain-icon
        v-if="status === 'stoppable'"
        name="pause"
      />
      <plain-icon
        v-if="status === 'playing'"
        name="play"
        class="baldr-icon-spin"
      />
      <plain-icon
        v-if="status === 'fadeout'"
        name="fadeout"
        class="spin-counter-clockwise"
      />
    </div>
  </div>
</template>

<script>
import { MaterialIcon } from '@bldr/vue-plugin-material-icon'

const circleRadius = 100;
// 100%: 628.3185307179587
const circumference = Math.PI * 2 * circleRadius

export default {
  name: 'PlayButton',
  props: {
    sample: {
      type: Object
    }
  },
  components: {
    MaterialIcon
  },
  data () {
    return {
      // starting
      // fadein
      // playing
      // fadeout
      // stopped
      // stoppable
      status: 'stopped',
      mediaElement: null
    }
  },
  methods: {
    start () {
      this.$media.player.load(this.sample)
      this.$media.player.start()
    },
    /**
     * Set the progress on the first visible circle.
     * Updates the stroke dash offset of the first visible circle
     *
     * @param {Number} progress - From 0 to 1.
     */
    setProgress (progress = 0.5) {
      this.$refs.progress.style.strokeDashoffset = -(circumference * progress)
    },
    actByStatus () {
      if (!this.mediaElement.paused) {
        this.$media.player.stop()
      } else if (this.status === 'stopped') {
        this.start()
      }
    }
  },
  mounted () {
    this.mediaElement = this.sample.mediaElement

    // Mount a playing media element.
    if (!this.mediaElement.paused) {
      this.status = 'playing'
    }

    this.$media.player.events.on('start', (loadedSample) => {
      if (loadedSample.uri === this.sample.uri) this.status = 'starting'
    })

    this.$el.onmouseenter = () => {
      if (this.status === 'playing') {
        this.status = 'stoppable'
      }
    }

    this.$el.onmouseleave = () => {
        if (!this.mediaElement.paused) {
        if (this.sample.playbackState === 'fadeout') {
          this.status = 'fadeout'
        } else {
          this.status = 'playing'
        }
      }
    }

    this.mediaElement.ontimeupdate = (event) => {
      if (!this.$refs.progress) return
      this.setProgress(this.sample.progress)
    }

    this.sample.events.on('fadeinend', () => {
      this.status = 'playing'
    })

    this.mediaElement.onplay = (event) => {
      this.status = 'fadein'
    }

    this.mediaElement.onpause = (event) => {
      this.status = 'stopped'
    }

    this.sample.events.on('fadeoutbegin', () => {
      this.status = 'fadeout'
    })
  }
}
</script>

<style lang="scss" scoped>
  .vc_play_button {
    line-height: 1em;
    width: 1em;
    height: 1em;
    position: relative;
    display: inline-block;
    color: $gray;

    .icons {
      width: 1em;
      height: 1em;
      left: 0;
      position: absolute;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .baldr-icon {
        font-size: 0.7em;
      }
    }

    &.stopped:hover {
      color: $blue;
    }

    &:active {
      color: $green;
    }

    &.playing {
      color: $blue
    }

    circle {
      stroke-width: 0.6em;
      fill: none;
    }

    .circle-base {
      stroke: $blue;
    }

    .circle-progress {
      stroke: $gray;
      stroke-dasharray: 628.3185307179587;
    }

    .spin-clockwise {
      animation: spin-clockwise 3s linear infinite;
    }

    @keyframes spin-clockwise {
      0% {
        transform: rotate(-270deg);
      }
      100% {
        transform: rotate(90deg);
      }
    }

    .spin-counter-clockwise {
      animation: spin-counter-clockwise 3s linear infinite;
    }

    @keyframes spin-counter-clockwise {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(-360deg);
      }
    }
  }
</style>
