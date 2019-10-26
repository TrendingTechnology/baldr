<template>
  <span class="vc_play_button">
    <material-icon
      v-if="started"
      name="play-speed"
      class="baldr-icon-spin"
    />
    <material-icon
      v-if="!playing && !started"
      name="play"
      @click.native="start"
    />
    <material-icon
      v-if="playing"
      name="pause"
      @click.native="$media.player.stop()"
    />
  </span>
</template>

<script>
/* globals compilationTime gitHead */
import { MaterialIcon } from '@bldr/vue-component-material-icon'

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
      started: false,
      playing: false
    }
  },
  methods: {
    start () {
      console.log(`Click event PlayButton “${this.sample.uri}”`)
      this.started = true
      this.$media.player.load(this.sample)
      this.$media.player.start()
    }
  },
  created () {
    this.sample.mediaElement.onplay = (event) => {
      this.playing = true
      this.started = false
    }
    this.sample.mediaElement.onpause = (event) => {
      this.playing = false
    }
  }
}
</script>

