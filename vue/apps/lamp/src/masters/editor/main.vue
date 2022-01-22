<template>
  <div class="vc_editor_master" spellcheck="false">
    <div class="editor-toolbar gradually-appear" b-ui-theme="default">
      <clickable-icon @click.native="formatHeading1" name="editor-heading-1" />
      <clickable-icon @click.native="formatHeading2" name="editor-heading-2" />
      <clickable-icon @click.native="formatHeading3" name="editor-heading-3" />
      <clickable-icon @click.native="formatBold" name="editor-bold" />
      <clickable-icon @click.native="formatUnderline" name="editor-underline" />
      <clickable-icon @click.native="formatList" name="editor-list" />
    </div>
    <div ref="editedMarkup" v-html="markupSafe"></div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const defaultMarkup = `<p contenteditable>${placeholderTag}</p>`

@Component
export default class EditorMasterMain extends MasterMain {
  masterName = 'editor'

  $refs: {
    editedMarkup: HTMLDivElement
  }

  @Prop({
    type: String
  })
  markup: string

  get markupSafe (): string {
    if (this.slideNg.data?.editedMarkup != null) {
      return this.slideNg.data.editedMarkup
    } else if (this.markup != null) {
      return this.markup
    } else if (this.slideNg.fields.markup != null) {
      return this.slideNg.fields.markup
    } else {
      return defaultMarkup
    }
  }

  private surround (elementName: string): void {
    const selection = window.getSelection()
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      const element = document.createElement(elementName)
      range.surroundContents(element)
    }
  }

  private insertHtml (html: string): void {
    const range = document.getSelection().getRangeAt(0)
    const fragment = document.createRange().createContextualFragment(html)
    range.insertNode(fragment)
  }

  formatHeading1 (): void {
    this.surround('h1')
  }

  formatHeading2 (): void {
    this.surround('h2')
  }

  formatHeading3 (): void {
    this.surround('h3')
  }

  formatBold (): void {
    this.surround('strong')
  }

  formatUnderline (): void {
    this.surround('u')
  }

  formatList (): void {
    this.insertHtml('<ul><li>.</li></ul>')
  }

  created (): void {
    // We can not use mousetrap because mousetrap is disable in
    // contenteditable areas.
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault()
        this.formatBold()
      } else if (event.ctrlKey && event.key === 'u') {
        event.preventDefault()
        this.formatUnderline()
      } else if (event.ctrlKey && event.key === 'l') {
        event.preventDefault()
        this.insertHtml('<ul><li>.</li></ul>')
      } else if (event.ctrlKey && event.key === '1') {
        event.preventDefault()
        this.formatHeading1()
      } else if (event.ctrlKey && event.key === '2') {
        event.preventDefault()
        this.formatHeading2()
      } else if (event.ctrlKey && event.key === '3') {
        event.preventDefault()
        this.formatHeading3()
      }
    })
  }

  private storeEditedMarkup () {
    if (this.slideNg.data == null) {
      this.slideNg.data = {}
    }
    this.slideNg.data.editedMarkup = this.$refs.editedMarkup.innerHTML
  }

  beforeSlideNoChange (): void {
    this.storeEditedMarkup()
  }

  afterSlideNoChange (): void {
    for (const element of document.querySelectorAll(
      '.vc_editor_master [contenteditable]'
    )) {
      element.addEventListener('focus', event => {
        const element = event.target
        if (element.innerHTML === placeholderTag) {
          element.innerHTML = ''
        }
      })
    }
    for (const element of document.querySelectorAll(
      '.vc_editor_master ul[contenteditable] li'
    )) {
      element.addEventListener('click', event => {
        const element = event.target
        element.innerHTML = ''
      })
    }
  }

  beforeDestroy (): void {
    this.storeEditedMarkup()
  }
}
</script>

<style lang="scss">
.vc_editor_master {
  // left right padding more because of ul ol etc ...
  padding: 1vw 4vw;

  .editor-toolbar {
    border: 1px solid $gray;
    position: absolute;
    right: 0em;
    top: 0em;

    .baldr-icon {
      font-size: 3vw;
      margin: 0 0.4em;
    }
  }

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
