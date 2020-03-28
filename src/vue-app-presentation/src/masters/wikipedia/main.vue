<template>
  <div class="vc_wikipedia_master main-app-padding">
    <p class="title">Wikipedia-Artikel: {{ title }} ({{ httpUrl }})</p>
    <div v-html="body"/>
  </div>
</template>

<script>
import axios from 'axios'

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
      required: true,
    },
    iframeHttpUrl: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
      body: null
    }
  },
  mounted() {
    // https://en.wikipedia.org/w/api.php?action=parse&page=Pet_door&prop=text&formatversion=2&format=json
    axios.get(`https://${this.language}.wikipedia.org/w/api.php`, {
      params: {
        action: 'parse',
        page: this.title,
        prop: 'text',
        formatversoin: 2,
        format: 'json',
        origin: '*',
        disableeditsection: true,
        disabletoc: true
      }
    })
    .then(response => {
      if (response.status === 200) {
        this.body = response.data.parse.text['*']
      }
    })
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
