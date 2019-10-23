<template>
  <div class="vc_media_file" b-ui-theme="default">
    <table class="key-value-table">
      <thead>
        <tr>
          <th class="key">key</th>
          <th>value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="key in mediaFile.propertiesSorted"
          :key="key"
        >
          <th class="key" v-if="typeof mediaFile[key] !== 'object'">{{ key }}</th>
          <td class="value" v-if="typeof mediaFile[key] !== 'object'">{{ mediaFile[key] }}</td>

        </tr>
      </tbody>
    </table>
    <div ref="mediaElementContainer" class="media-file-element">
      <img v-if="mediaFile.previewImage" :src="mediaFile.previewHttpUrl"/>
      <ol class="samples" >
        <li v-for="sample in mediaFile.samples" :key="sample.id" @click="playSample(sample)">
          <play-button :sample="sample"/> {{ sample.title }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue'

export default {
  name: 'MediaFile',
  components: {
    PlayButton
  },
  computed: {
    uri () {
      const params = this.$route.params
      return `${params.uriScheme}:${params.uriAuthority}`
    },
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.uri)
    }
  },
  methods: {
    playSample (sample) {
      this.$media.player.load(sample)
      this.$media.player.play()
    }
  },
  async mounted () {
    if (!this.mediaFile) await this.$media.resolve(this.uri)
    if (this.mediaFile.isPlayable) {
      this.mediaFile.mediaElement.controls = true
    }
    this.$refs.mediaElementContainer.appendChild(this.mediaFile.mediaElement)
  }
}
</script>

<style lang="scss" scoped>
  .vc_media_file {
    font-size: 1vw;
    width: 100vw;
    height: 100vh;
    display: flex;
    padding: 4vw;

    .media-file-element, .key-value-table {
      width: 50vw;
      padding: 1vw;
    }

    .key {
      text-align: right;
      padding-right: 1em;
    }

    .value {
      max-width: 30vw;
      font-size: 0.8em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>

<style lang="scss">
  .vc_media_file {
    .media-file-element {
      img {
        width: 30vw;
      }
    }
  }
</style>