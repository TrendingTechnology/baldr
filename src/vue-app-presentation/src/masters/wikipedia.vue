<template>
  <div class="vc_wikipedia_master">
    <p class="title">Wikipedia-Artikel: {{ title }} ({{ url }})</p>
    <div class="iframe-wrapper">
      <iframe
        :src="`https://${language}.wikipedia.org/w/index.php?title=${title}&printable=yes`"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
const defaultLanguage = 'de'

const example = `
---
slides:

- title: Short form
  wikipedia: Franz_Seraph_Reicheneder

- title: Long form
  wikipedia:
    language: en
    title: Ludwig_van_Beethoven

- title: Long form (German Umlaute)
  wikipedia:
    title: August_Högn
`

export const master = {
  title: 'Wikipedia',
  icon: {
    name: 'wikipedia',
    color: 'black'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { title: props }
    }
    if (!props.language) props.language = defaultLanguage
    return props
  },
  plainTextFromProps (props) {
    return `${props.title} (${props.language})`
  }
}

export default {
  props: {
    title: {
      type: String,
      required: true,
      description: 'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
    },
    language: {
      type: String,
      description: 'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
      default: defaultLanguage
    }
  },
  computed: {
    url () {
      return `https://${this.language}.wikipedia.org/wiki/${this.title}`
    }
  }
}
</script>

<style lang="scss" scoped>
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
