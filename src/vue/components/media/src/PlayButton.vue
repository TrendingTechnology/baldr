<template>
  <span class="vc_play_button">
    <material-icon
      v-if="paused"
      name="play"
      @click.native="play"
    />
    <material-icon
      v-if="!paused"
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
      paused: true,
    }
  },
  methods: {
    play () {
      this.$media.player.load(this.sample)
      this.$media.player.start()
    }
  },
  created () {
    this.sample.mediaElement.onplay = (event) => {
      this.paused = false
    }
    this.sample.mediaElement.onpause = (event) => {
      this.paused = true
    }
  }
}
</script>

