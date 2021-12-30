<template>
  <div class="vc_external_sites">
    <a
      v-if="imslp"
      :href="imslp"
      title="IMSLP (Petrucci Music Library)"
      target="_blank"
    >
      <plain-icon name="imslp" />
    </a>
    <a
      v-if="musicbrainzRecordingId"
      :href="musicbrainzRecordingId"
      title="MusicBrainz (Recording)"
      target="_blank"
    >
      <plain-icon name="musicbrainz-recording" />
    </a>
    <a
      v-if="musicbrainzWorkId"
      :href="musicbrainzWorkId"
      title="MusicBrainz (Work)"
      target="_blank"
    >
      <plain-icon name="musicbrainz-work" />
    </a>
    <a
      v-if="wikicommons"
      :href="wikicommons"
      title="Wikicommons"
      target="_blank"
    >
      <plain-icon name="wikicommons" />
    </a>
    <a v-if="wikidata" :href="wikidata" title="Wikidata" target="_blank">
      <plain-icon name="wikidata" />
    </a>
    <a v-if="wikipedia" :href="wikipedia" title="Wikipedia" target="_blank">
      <plain-icon name="wikipedia" />
    </a>
    <a v-if="youtube" :href="youtube" title="Youtube" target="_blank">
      <plain-icon name="youtube" />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import {
  formatImslpUrl,
  formatMusicbrainzRecordingUrl,
  formatMusicbrainzWorkUrl,
  formatWikicommonsUrl,
  formatWikidataUrl,
  formatWikipediaUrl,
  formatYoutubeUrl
} from '@bldr/string-format'

@Component
export default class ExternalSites extends Vue {
  @Prop({
    type: Object
  })
  asset: any

  get yaml (): Record<string, string> {
    if (this.asset.yaml != null) {
      return this.asset.yaml
    } else {
      return this.asset
    }
  }

  get imslp (): string | undefined {
    if (this.yaml.imslp) {
      return formatImslpUrl(this.yaml.imslp)
    }
  }

  get musicbrainzRecordingId (): string | undefined {
    if (this.yaml.musicbrainzRecordingId) {
      return formatMusicbrainzRecordingUrl(this.yaml.musicbrainzRecordingId)
    }
  }

  get musicbrainzWorkId (): string | undefined {
    if (this.yaml.musicbrainzWorkId) {
      return formatMusicbrainzWorkUrl(this.yaml.musicbrainzWorkId)
    }
  }

  get wikicommons (): string | undefined {
    if (this.yaml.wikicommons) {
      return formatWikicommonsUrl(this.yaml.wikicommons)
    }
    for (const prop in this.yaml) {
      const value = this.yaml[prop]
      if (value && typeof value === 'string' && value.match(/^wikicommons:/)) {
        return formatWikicommonsUrl(value.replace(/^wikicommons:/, ''))
      }
    }
  }

  get wikidata (): string | undefined {
    if (this.yaml.wikidata) {
      return formatWikidataUrl(this.yaml.wikidata)
    }
  }

  get wikipedia (): string | undefined {
    if (this.yaml.wikipedia) {
      return formatWikipediaUrl(this.yaml.wikipedia)
    }
  }

  get youtube (): string | undefined {
    if (this.yaml.youtube) {
      return formatYoutubeUrl(this.yaml.youtube)
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
