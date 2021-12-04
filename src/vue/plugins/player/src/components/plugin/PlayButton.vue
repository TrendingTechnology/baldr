<template>
  <div
    class="vc_play_button"
    :class="status"
    @click="actByStatus"
    :title="htmlTitle"
  >
    <svg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(125,125)">
        <circle r="100" class="circle-base" />
        <g transform="rotate(-90)">
          <circle r="100" ref="progress" class="circle-progress" />
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
      <plain-icon v-if="status === 'stopped'" name="play" />
      <plain-icon v-if="status === 'stoppable'" name="pause" />
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

<script lang="ts">
import { MaterialIcon } from '@bldr/icons'
import { Component, Vue, Watch, Prop } from '@bldr/vue-packages-bundler'
import { player } from '../../app'
import { Playable } from '../../main'

const circleRadius = 100
// 100%: 628.3185307179587
const circumference = Math.PI * 2 * circleRadius

@Component({
  props: {
    playable: {
      type: Object
    }
  },
  components: {
    MaterialIcon
  }
})
export default class PlayButton extends Vue {
  @Prop()
  playable!: Playable

  status:
    | 'starting'
    | 'fadein'
    | 'playing'
    | 'fadeout'
    | 'stopped'
    | 'stoppable' = 'stopped'

  htmlElement!: HTMLMediaElement

  data () {
    return {
      status: 'stopped',
      htmlElement: null
    }
  }

  htmlTitle () {
    if (this.playable.sample.shortcut) {
      return `${this.playable.sample.titleSafe} [${this.playable.sample.shortcut}]`
    }
    return this.playable.sample.titleSafe
  }

  registerEvents () {
    this.htmlElement = this.playable.htmlElement
    // Mount a playing media element.
    if (!this.htmlElement.paused) {
      this.status = 'playing'
    } else {
      this.status = 'stopped'
    }

    player.events.on('fadeinbegin', (loadedPlayable: Playable) => {
      if (
        loadedPlayable.sample.ref != null &&
        loadedPlayable.sample.ref === this.playable.sample.ref
      ) {
        this.status = 'starting'
      }
    })

    this.$el.addEventListener('mouseenter', () => {
      if (this.status === 'playing') {
        this.status = 'stoppable'
      }
    })

    this.$el.addEventListener('mouseleave', () => {
      if (!this.htmlElement.paused) {
        if (this.playable.playbackState === 'fadeout') {
          this.status = 'fadeout'
        } else {
          this.status = 'playing'
        }
      }
    })

    this.htmlElement.addEventListener('timeupdate', event => {
      if (!this.$refs.progress) return
      this.setProgress(this.playable.progress)
    })

    this.playable.events.on('fadeinend', () => {
      this.status = 'playing'
    })

    this.htmlElement.addEventListener('play', event => {
      this.status = 'fadein'
    })

    this.htmlElement.addEventListener('pause', event => {
      this.status = 'stopped'
    })

    this.playable.events.on('fadeoutbegin', () => {
      this.status = 'fadeout'
    })
  }

  async start (): Promise<void> {
    await player.start(this.playable.sample.ref)
  }

  /**
   * Set the progress on the first visible circle.
   * Updates the stroke dash offset of the first visible circle
   *
   * @param progress - From 0 to 1.
   */
  setProgress (progress = 0.5) {
    const htmlElement = this.$refs.progress as HTMLElement
    htmlElement.style.strokeDashoffset = `${-(circumference * progress)}`
  }

  actByStatus () {
    if (!this.htmlElement.paused) {
      player.stop()
    } else if (this.status === 'stopped') {
      this.start()
    }
  }

  @Watch('playable')
  onPlayableChange () {
    this.registerEvents()
  }

  mounted () {
    this.registerEvents()
  }
}
</script>

<style lang="scss">
.vc_play_button {
  color: $gray;
  display: inline-block;
  height: 1em;
  line-height: 1em;
  position: relative;
  width: 1em;

  .icons {
    align-items: center;
    display: flex;
    height: 1em;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 1em;

    .baldr-icon {
      font-size: 0.6em;
    }
  }

  &.stopped:hover {
    color: $blue;
  }

  &:active {
    color: $green;
  }

  &.playing {
    color: $blue;
  }

  circle {
    fill: none;
    stroke-width: 0.3em;
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
