<template>
  <div class="vc_media_file" b-ui-theme="default" v-if="asset">
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
            v-for="(value, key) in asset.yaml"
            :key="key"
          >
            <th class="key">{{ key }}</th>
            <td class="value">{{ value }}</td>
          </tr>
        </tbody>
      </table>

      <div ref="mediaElementContainer" class="asset-element">
        <img v-if="asset.previewHttpUrl" :src="asset.previewHttpUrl"/>
        <ol class="samples" >
          <li v-for="sample in asset.samples" :key="sample.uri">
            <!-- <play-button :sample="sample"/>  -->
            {{ sample.title }} [#{{ sample.id }}]
          </li>
        </ol>
      </div>

    </section>

    <section>

      <h2>Links</h2>
      <ul>
        <li @click="openEditor"><span class="link">Im Text-Editor öffnen</span></li>

        <li v-if="asset.youtube">
          <a :href="formatYoutubeUrl(asset.youtube)">YouTube</a>
        </li>

        <li v-if="asset.musicbrainzRecordingId">
          <a :href="formatMusicbrainzRecordingUrl(asset.musicbrainzRecordingId)">MusicBrainz</a>
        </li>
      </ul>

    </section>
  </div>
</template>

<script>
// import PlayButton from './PlayButton.vue'
import { formatMusicbrainzRecordingUrl, formatYoutubeUrl } from '@bldr/string-format'

export default {
  name: 'ClientMediaAsset',
  components: {
    // PlayButton
  },
  computed: {
    uri () {
      const params = this.$route.params
      return `${params.uriScheme}:${params.uriAuthority}`
    },
    asset () {
      return this.$store.getters['media/assetByUri'](this.uri)
    }
  },
  methods: {
    openEditor () {
      this.$media.httpRequest.request({
        url: 'mgmt/open',
        params: {
          with: 'editor',
          type: 'assets',
          ref: this.asset.ref
        }
      })
    },
    formatYoutubeUrl,
    formatMusicbrainzRecordingUrl
  },
  async mounted () {
    if (!this.asset) {
      await this.$media.resolve(this.uri)
    }
    if (this.asset.htmlElement != null) {
      if (this.asset.isPlayable) {
        this.asset.htmlElement.controls = true
      }
      this.$refs.mediaElementContainer.appendChild(this.asset.htmlElement)
    }

  }
}
</script>

<style lang="scss">
  .vc_media_file {
    font-size: 1vw;
    height: 100vh;
    padding: 4vw;
    width: 100vw;

    .table-and-preview {
      display: flex;
    }

    .asset-element {
      img {
        width: 30vw;
      }
    }

    .asset-element, .key-value-table {
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
