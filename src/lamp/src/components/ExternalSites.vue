<template>
  <div class="vc_external_sites">
    <a v-if="wikipedia" :href="wikipedia">
      <plain-icon name="wikipedia"/>
    </a>
    <a v-if="wikidata" :href="wikidata">
      <plain-icon name="wikidata"/>
    </a>
  </div>
</template>

<script>
import { formatWikipediaUrl, formatWikidataUrl } from '@bldr/core-browser'

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
        return formatWikipediaUrl(this.asset.wikipedia)
      }
    },
    wikidata () {
      if (this.asset.wikidata) {
        return formatWikidataUrl(this.asset.wikidata)
      }
    }
  }
}
</script>

<style lang="scss">
  .vc_external_sites {
    bottom: 8em;
    display: flex;
    flex-direction: column;
    font-size: 1.5em;
    opacity: 0.5;
    position: absolute;
    right: 0.4em;
  }
</style>
