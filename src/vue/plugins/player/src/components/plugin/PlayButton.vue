<template>
  <div
    class="vc_play_button"
    :class="playbackState"
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
        v-if="playbackState === 'starting'"
        name="play-speed"
        class="baldr-icon-spin"
      />
      <plain-icon
        v-if="playbackState === 'fadein'"
        name="fadeout"
        class="spin-clockwise"
      />
      <plain-icon v-if="playbackState === 'stopped'" name="play" />
      <plain-icon v-if="playbackState === 'stoppable'" name="pause" />
      <plain-icon
        v-if="playbackState === 'playing'"
        name="play"
        class="baldr-icon-spin"
      />
      <plain-icon
        v-if="playbackState === 'fadeout'"
        name="fadeout"
        class="spin-counter-clockwise"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PlainIcon } from '@bldr/icons'
import { Component, Vue, Watch, Prop } from '@bldr/vue-packages-bundler'

import { player } from '../../plugin'
import { Playable, PlaybackState } from '../../playable'

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
    PlainIcon
  }
})
export default class PlayButton extends Vue {
  @Prop()
  playable!: Playable

  /**
   * We add two more states to the playback states of a playable.
   *
   * - `starting`: We want until a already playing sample stops
   * - `stoppable`: If the sample is fading in, playing or fading out,
   *    it is stoppable.
   */
  playbackState:
    | 'starting'
    | 'fadein'
    | 'playing'
    | 'fadeout'
    | 'stopped'
    | 'stoppable' = 'stopped'

  data () {
    return {
      playbackState: 'stopped',
      htmlElement: null
    }
  }

  get htmlTitle (): string {
    if (this.playable == null) {
      return ''
    }
    if (this.playable.sample.shortcut) {
      return `${this.playable.sample.titleSafe} [${this.playable.sample.shortcut}]`
    }
    return this.playable.sample.titleSafe
  }

  private setPlaybackStateFromPlayable (): void {
    if (this.playbackState !== 'starting') {
      this.playbackState = this.playable.playbackState
    }
  }

  private updateProgress (playable: Playable) {
    if (!this.$refs.progress) {
      return
    }
    this.setProgress(this.playable.progress)
  }

  private updatePlaybackState (playbackState: PlaybackState) {
    this.playbackState = playbackState
  }

  registerEvents (): void {
    if (this.playable == null) {
      return
    }

    this.setPlaybackStateFromPlayable()

    this.$el.addEventListener('mouseenter', () => {
      if (this.playbackState === 'playing') {
        this.playbackState = 'stoppable'
      }
    })

    this.$el.addEventListener('mouseleave', () => {
      this.setPlaybackStateFromPlayable()
    })

    this.playable.registerTimeUpdateListener(this.updateProgress)
    this.playable.registerPlaybackChangeListener(this.updatePlaybackState)
  }

  /**
   * Set the progress on the first visible circle.
   * Updates the stroke dash offset of the first visible circle
   *
   * @param progress - From 0 to 1.
   */
  setProgress (progress: number): void {
    const htmlElement = this.$refs.progress as HTMLElement
    htmlElement.style.strokeDashoffset = `${-(circumference * progress)}`
  }

  async actByStatus (): Promise<void> {
    if (this.playable.playbackState !== 'stopped') {
      player.stop()
    } else {
      this.playbackState = 'starting'
      await player.start(this.playable.sample.ref)
    }
  }

  @Watch('playable')
  onPlayableChange (): void {
    this.registerEvents()
  }

  mounted () {
    // Activate a play button, when a playable is already playing
    this.registerEvents()
  }

  beforeDestroy () {
    this.playable.removeEventsListener(this.updateProgress)
    this.playable.removeEventsListener(this.updatePlaybackState)
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
