<template>
  <div class="media-player" v-show="show">
    <h1>Media player</h1>

    <div v-if="mediaFile">
      {{ mediaFile.titleSafe }}
      {{ currentTime }} /
      {{ mediaElement.duration }}
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


export default {
  name: 'MediaPlayer',

  components: {
    MaterialIcon
  },
  data () {
    return {
      show: false,
      currentTime: 0
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
      this.currentTime = parseInt(this.mediaFile.currentTime);
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
