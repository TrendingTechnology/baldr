<template>
  <div class="vc_editor_master" spellcheck="false">
    <div class="editor-toolbar gradually-appear" b-ui-theme="default">
      <clickable-icon
        @click.native="formatHeading1"
        name="editor-heading-1"
        title="Überschrift 1 (Strg + 1)"
      />
      <clickable-icon
        @click.native="formatHeading2"
        name="editor-heading-2"
        title="Überschrift 2 (Strg + 2)"
      />
      <clickable-icon
        @click.native="formatHeading3"
        name="editor-heading-3"
        title="Überschrift 3 (Strg + 3)"
      />
      <clickable-icon
        @click.native="formatBold"
        name="editor-bold"
        title="fett (Strg + b)"
      />
      <clickable-icon
        @click.native="formatUnderline"
        name="editor-underline"
        title="unterstrichen (Strg + u)"
      />
      <clickable-icon
        @click.native="formatList"
        name="editor-list"
        title="Liste beginnen (Strg + l)"
      />
      <clickable-icon
        @click.native="formatReset"
        name="editor-reset"
        title="Editor leeren (auf Standartwerte zurücksetzen)"
      />
    </div>
    <div ref="editedMarkup" v-html="markupSafe"></div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

import { editorMModul } from '@bldr/presentation-parser'

@Component
export default class EditorMasterMain extends MasterMain {
  masterName = 'editor'

  $refs!: {
    editedMarkup: HTMLDivElement
  }

  @Prop({
    type: String
  })
  markup!: string

  get markupDefault (): string {
    if (this.markup != null) {
      return this.markup
    } else if (this.slideNg.fields?.markup != null) {
      return this.slideNg.fields.markup
    } else {
      return editorMModul.DEFAULT_MARKUP
    }
  }

  get markupSafe (): string {
    if (this.slideNg.data?.editedMarkup != null) {
      return this.slideNg.data.editedMarkup
    } else if (this.markup != null) {
      return this.markup
    } else if (this.slideNg.fields?.markup != null) {
      return this.slideNg.fields.markup
    } else {
      return editorMModul.DEFAULT_MARKUP
    }
  }

  private surround (elementName: string): void {
    const selection = document.getSelection()
    if (selection != null && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const element = document.createElement(elementName)
      range.surroundContents(element)
    }
  }

  private insertHtml (html: string): void {
    const selection = document.getSelection()
    if (selection != null) {
      const range = selection.getRangeAt(0)
      const fragment = document.createRange().createContextualFragment(html)
      range.insertNode(fragment)
    }
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

  formatReset (): void {
    this.$refs.editedMarkup.innerHTML = this.markupDefault
    this.registerPlaceholderRemover()
  }

  created (): void {
    // We can not use mousetrap because mousetrap is disable in
    // contenteditable areas.
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && ['b', 'u', 'l', '1', '2', '3'].includes(event.key)) {
        event.preventDefault()
      }
      if (event.ctrlKey && event.key === 'b') {
        this.formatBold()
      } else if (event.ctrlKey && event.key === 'u') {
        this.formatUnderline()
      } else if (event.ctrlKey && event.key === 'l') {
        this.formatList()
      } else if (event.ctrlKey && event.key === '1') {
        this.formatHeading1()
      } else if (event.ctrlKey && event.key === '2') {
        this.formatHeading2()
      } else if (event.ctrlKey && event.key === '3') {
        this.formatHeading3()
      }
    })
  }

  private storeEditedMarkup (): void {
    if (this.slideNg.data == null) {
      this.slideNg.data = {}
    }
    this.slideNg.data.editedMarkup = this.$refs.editedMarkup.innerHTML
  }

  beforeSlideNoChange (): void {
    this.storeEditedMarkup()
  }

  registerPlaceholderRemover (): void {
    for (const element of document.querySelectorAll(
      '.vc_editor_master [contenteditable]'
    )) {
      element.addEventListener('focus', event => {
        const element = event.target as HTMLElement
        if (element.innerHTML === editorMModul.PLACEHOLDER_TAG) {
          element.innerHTML = ''
        }
      })
    }
    for (const element of document.querySelectorAll(
      '.vc_editor_master ul[contenteditable] li'
    )) {
      element.addEventListener('click', event => {
        const element = event.target as HTMLElement
        element.innerHTML = ''
      })
    }
  }

  afterSlideNoChange (): void {
    this.registerPlaceholderRemover()
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
