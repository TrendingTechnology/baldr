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
import { MaterialIcon } from '@bldr/vue-plugin-material-icon'

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
      playing: false,
      mediaFile: null
    }
  },
  methods: {
    start () {
      this.started = true
      this.$media.player.load(this.sample)
      this.$media.player.start()
    }
  },
  mounted () {
    this.mediaElement = this.sample.mediaElement
    this.mediaElement.onplay = (event) => {
      this.playing = true
      this.started = false
    }

    this.mediaElement.onpause = (event) => {
      this.playing = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_play_button {
    line-height: 1em;
  }
</style>
