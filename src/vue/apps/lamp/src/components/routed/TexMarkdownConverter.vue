<template>
  <div
    class="
      vc_tex_markdown_converter
      main-app-fullscreen
      main-app-padding
    "
    b-ui-theme="default"
  >
    <h2>TeX-Markdown-Konvertierung</h2>

    <textarea v-model="input" name="input" id="input" cols="80" rows="20" />

    <button @click="changeDirection">{{ buttonLabel }}</button>

    <pre><code>{{ output }}</code></pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

import { convertTexToMd, convertMdToTex } from '@bldr/tex-markdown-converter'

@Component
export default class TexMarkdownConverter extends Vue {
  input: string = ''
  output: string = ''
  toMarkdown = true

  get buttonLabel () {
    if (this.toMarkdown) {
      return 'TeX → Markdown'
    } else {
      return 'Markdown → TeX'
    }
  }

  changeDirection () {
    this.toMarkdown = !this.toMarkdown
    this.convert()
  }

  convert () {
    if (this.toMarkdown) {
      this.output = convertTexToMd(this.input)
    } else {
      this.output = convertMdToTex(this.input)
    }
  }

  @Watch('input')
  onInputChanged () {
    this.convert()
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
