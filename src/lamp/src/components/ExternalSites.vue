<template>
  <div class="vc_external_sites">
    <a v-if="wikipedia" :href="wikipedia" title="Wikipedia">
      <plain-icon name="wikipedia"/>
    </a>
    <a v-if="wikidata" :href="wikidata" title="Wikidata">
      <plain-icon name="wikidata"/>
    </a>
    <a v-if="musicbrainzRecordingId" :href="musicbrainzRecordingId" title="MusicBrainz (Recording)">
      <plain-icon name="musicbrainz"/>
    </a>
    <a v-if="musicbrainzWorkId" :href="musicbrainzWorkId" title="MusicBrainz (Work)">
      <plain-icon name="musicbrainz"/>
    </a>
    <a v-if="youtube" :href="youtube" title="Youtube">
      <plain-icon name="youtube"/>
    </a>
  </div>
</template>

<script>
import core from '@bldr/core-browser'

export default {
  name: 'ExternalSites',
  props: {
    asset: {
      type: Object
    }
  },
  computed: {
    wikipedia () {
      if (this.asset.wikipedia) {
        return core.formatWikipediaUrl(this.asset.wikipedia)
      }
      return ''
    },
    wikidata () {
      if (this.asset.wikidata) {
        return core.formatWikidataUrl(this.asset.wikidata)
      }
      return ''
    },
    musicbrainzRecordingId () {
      if (this.asset.musicbrainzRecordingId) {
        return core.formatBrainzRecUrl(this.asset.musicbrainzRecordingId)
      }
      return ''
    },
    musicbrainzWorkId () {
      if (this.asset.musicbrainzWorkId) {
        return core.formatBrainzWorkUrl(this.asset.musicbrainzWorkId)
      }
      return ''
    },
    youtube () {
      if (this.asset.youtube) {
        return core.formatYoutubeUrl(this.asset.youtube)
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
  .vc_external_sites {
    bottom: 40%;
    display: flex;
    flex-direction: column;
    font-size: 1em;
    opacity: 0.1;
    position: absolute;
    right: 0.4em;
  }
</style>
