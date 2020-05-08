<template>
  <div class="vc_external_sites">
    <a v-if="imslp" :href="imslp" title="IMSLP (Petrucci Music Library)" target="_blank">
      <plain-icon name="imslp"/>
    </a>
    <a v-if="musicbrainzRecordingId" :href="musicbrainzRecordingId" title="MusicBrainz (Recording)" target="_blank">
      <plain-icon name="musicbrainz-recording"/>
    </a>
    <a v-if="musicbrainzWorkId" :href="musicbrainzWorkId" title="MusicBrainz (Work)" target="_blank">
      <plain-icon name="musicbrainz-work"/>
    </a>
    <a v-if="wikicommons" :href="wikicommons" title="Wikicommons" target="_blank">
      <plain-icon name="wikicommons"/>
    </a>
    <a v-if="wikidata" :href="wikidata" title="Wikidata" target="_blank">
      <plain-icon name="wikidata"/>
    </a>
    <a v-if="wikipedia" :href="wikipedia" title="Wikipedia" target="_blank">
      <plain-icon name="wikipedia"/>
    </a>
    <a v-if="youtube" :href="youtube" title="Youtube" target="_blank">
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
    imslp () {
      if (this.asset.imslp) {
        return core.formatImslpUrl(this.asset.imslp)
      }
      return ''
    },
    musicbrainzRecordingId () {
      if (this.asset.musicbrainzRecordingId) {
        return core.formatMusicbrainzRecordingUrl(this.asset.musicbrainzRecordingId)
      }
      return ''
    },
    musicbrainzWorkId () {
      if (this.asset.musicbrainzWorkId) {
        return core.formatMusicbrainzWorkUrl(this.asset.musicbrainzWorkId)
      }
      return ''
    },
    wikicommons () {
      if (this.asset.wikicommons) {
        return core.formatWikicommonsUrl(this.asset.wikicommons)
      }
      for (const prop in this.asset) {
        const value = this.asset[prop]
        if (value && typeof value === 'string' && value.match(/^wikicommons:/)) {
          return core.formatWikicommonsUrl(value.replace(/^wikicommons:/, ''))
        }
      }
      return ''
    },
    wikidata () {
      if (this.asset.wikidata) {
        return core.formatWikidataUrl(this.asset.wikidata)
      }
      return ''
    },
    wikipedia () {
      if (this.asset.wikipedia) {
        return core.formatWikipediaUrl(this.asset.wikipedia)
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
    font-size: 3vmin;
    opacity: 0.8;
    position: absolute;
    right: 0.4em;
    z-index: 1;

    a {
      color: $gray !important;
      text-shadow: 0 0 0.02em rgba($black, 0.05);
    }
  }
</style>
