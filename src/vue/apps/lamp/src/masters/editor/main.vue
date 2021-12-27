<template>
  <div class="vc_editor_master" spellcheck="false" v-html="markupSafe"></div>
</template>

<script lang="ts">
const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const defaultMarkup = `<p contenteditable>${placeholderTag}</p>`

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

@Component
export default class EditorMasterMain extends MasterMain {
  masterName = 'editor'

  @Prop({
    type: String
  })
  markup: string

  get markupSafe (): string {
    if (this.markup) {
      return this.markup
    } else {
      return defaultMarkup
    }
  }

  private surround (elementName) {
    const selection = window.getSelection()
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      const element = document.createElement(elementName)
      range.surroundContents(element)
    }
  }

  insertHtml (html) {
    const range = document.getSelection().getRangeAt(0)
    const fragment = document.createRange().createContextualFragment(html)
    range.insertNode(fragment)
  }

  created () {
    // We can not use mousetrap because mousetrap is disable in
    // contenteditable areas.
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault()
        this.surround('strong')
      } else if (event.ctrlKey && event.key === 'u') {
        event.preventDefault()
        this.surround('u')
      } else if (event.ctrlKey && event.key === 'l') {
        event.preventDefault()
        this.insertHtml('<ul><li>.</li></ul>')
      } else if (event.ctrlKey && event.key === '1') {
        event.preventDefault()
        this.surround('h1')
      } else if (event.ctrlKey && event.key === '2') {
        event.preventDefault()
        this.surround('h2')
      }
    })
  }
}
</script>

<style lang="scss">
.vc_editor_master {
  // left right padding more because of ul ol etc ...
  padding: 1vw 4vw;

  .editor-placeholder {
    font-size: 0.5em;
    color: gray;
    opacity: 0.5;
  }

  [contenteditable] {
    min-height: 1.5em;
  }

  table {
    table-layout: fixed;
  }
}
</style>
