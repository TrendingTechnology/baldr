<template>
  <div class="vc_wikipedia_master">
    <iframe
      :src="`http://${language}.wikipedia.org/w/index.php?title=${title}&printable=yes`"
      frameborder="0"
    />
  </div>
</template>

<script>

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
  icon: 'wikipedia',
  color: 'black',
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { title: props }
    }
    return props
  },
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
      default: 'de'
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_wikipedia_master {
    text-align: center;

    iframe {
      width: 70vw;
      height: 95vh;
      border: 1px solid scale-color($gray, $lightness: 30%);
      padding: 1vw;
      background-color: white;
    }
  }
</style>