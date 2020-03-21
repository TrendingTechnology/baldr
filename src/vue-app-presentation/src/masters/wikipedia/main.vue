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
  .vc_wikipedia_master {
    .title {
      margin-left: 10vw;
    }

    .iframe-wrapper {
      text-align: center;

      iframe {
        background-color: white;
        border: 1px solid scale-color($gray, $lightness: 30%);
        height: 95vh;
        padding: 1vw;
        width: 70vw;
      }
    }
  }
</style>
