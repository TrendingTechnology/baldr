<template>
  <div class="vc_tex_markdown_converter main-app-fullscreen main-app-padding" b-ui-theme="default">
    <h2>TeX-Markdown-Konvertierung</h2>

    <textarea v-model="input" name="input" id="input" cols="80" rows="20"></textarea>

    <button @click="changeDirection">{{ buttonLabel }}</button>

    <pre><code>{{ output }}</code></pre>
  </div>
</template>

<script>
import { convertTexToMd, convertMdToTex } from '@bldr/core-browser'

export default {
  name: 'TexMarkdownConverter',
  watch: {
    input () {
      this.convert()
    }
  },
  computed: {
    buttonLabel () {
      if (this.toMarkdown) {
        return 'TeX → Markdown'
      } else {
        return 'Markdown → TeX'
      }
    }
  },
  methods: {
    changeDirection () {
      this.toMarkdown = !this.toMarkdown
      this.convert()
    },
    convert () {
      if (this.toMarkdown) {
        this.output = convertTexToMd(this.input)
      } else {
        this.output = convertMdToTex(this.input)
      }
    }
  },
  data () {
    return {
      input: '',
      output: '',
      toMarkdown: true
    }
  }
}
</script>

<style lang="scss">
  .vc_tex_markdown_converter {
    textarea {
      display: block;
      width: 100%;
    }
    button {
      margin-top: 1em !important;
    }
  }
</style>
