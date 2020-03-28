<template>
  <div class="vc_wikipedia_master main-app-padding">
    <p class="title">Wikipedia-Artikel: {{ title }} ({{ httpUrl }})</p>
    <div v-html="body"/>
  </div>
</template>

<script>
import axios from 'axios'
import { getHtmlBody, getFirstImage } from './main.js'

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    httpUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      body: null
    }
  },
  async mounted() {
    const id = `${this.language}:${this.title}`
    let body = this.$store.getters['presMasterWikipedia/bodyById'](id)
    if (body) {
      this.body = body
    } {
      this.body = await getHtmlBody(this.title, this.language)
      this.$store.commit(
        'presMasterWikipedia/addBody',
        { id, body: this.body }
      )
    }
  }
}
</script>
<style lang="scss">
  // https://de.wikipedia.org/wiki/Wikipedia:Technik/Skin/CSS/Selektoren_unter_MediaWiki
  // https://de.wikipedia.org/wiki/Wikipedia:Technik/Skin/MediaWiki#wmfCSS
  .vc_wikipedia_master {
    .title {
      margin-left: 10vw;
    }

    // Belege fehlen
    .noprint,
    // Personendaten
    .metadata,
    // "Beethoven" redirects here. For other uses, see Beethoven (disambiguation).
    .hatnote,
    // Citations
    .reflist,
    // First Viennese School
    // - Joseph Haydn
    // - Wolfgang Amadeus Mozart
    // - Ludwig van Beethoven
    // - Franz Schubert
    .navbox {
      display: none;
    }

    .tleft {
      clear: left; // To avoid stacked floats
      float: left;
    }

    .tright, .infobox {
      clear: right; // To avoid stacked floats
      float: right;
    }

  }
</style>
