<template>
  <div class="vc_media_file" b-ui-theme="default">
    <section class="table-and-preview">

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
          <li v-for="sample in mediaFile.samples" :key="sample.uri">
            <play-button :sample="sample"/> {{ sample.title }} [#{{ sample.id }}]
          </li>
        </ol>
      </div>

    </section>

    <section>

      <h2>Links</h2>
      <ul>
        <li v-if="mediaFile.youtube">
          <a :href="`https://youtu.be/${mediaFile.youtube}`">YouTube</a>
        </li>

        <li v-if="mediaFile.musicbrainzRecordingId">
          <a :href="`https://musicbrainz.org/recording/${mediaFile.musicbrainzRecordingId}`">MusicBrainz</a>
        </li>
      </ul>

    </section>
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
    height: 100vh;
    padding: 4vw;
    width: 100vw;

    .table-and-preview {
      display: flex;
    }

    .media-file-element, .key-value-table {
      padding: 1vw;
      width: 50vw;
    }

    .key {
      padding-right: 1em;
      text-align: right;
    }

    .value {
      font-size: 0.8em;
      max-width: 30vw;
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