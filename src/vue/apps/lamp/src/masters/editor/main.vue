<template>
  <div
    class="vc_editor_master"
    spellcheck="false"
    v-html="markupSafe"
  >
  </div>
</template>

<script>
import { mapStepFieldDefintions } from '@bldr/presentation-parser'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const defaultMarkup = `<p contenteditable>${placeholderTag}</p>`

export default {
  props: {
    markup: {
      type: String
    },
    ...mapStepFieldDefintions(['mode', 'subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
    markupSafe () {
      if (this.markup) {
        return this.markup
      } else {
        return defaultMarkup
      }
    }
  },
  methods: {
    onSlideChange () {
      for (const element of document.querySelectorAll('.vc_editor_master [contenteditable]')) {
        element.addEventListener('focus', (event) => {
          const element = event.target
          if (element.innerHTML === placeholderTag) {
            element.innerHTML = ''
          }
        })
      }
      for (const element of document.querySelectorAll('.vc_editor_master ul[contenteditable] li')) {
        element.addEventListener('click', (event) => {
          const element = event.target
          element.innerHTML = ''
        }
        )
      }
    },
    /**
     * @private
     */
    surround_ (elementName) {
      const selection = window.getSelection()
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0)
        const element = document.createElement(elementName)
        range.surroundContents(element)
      }
    },
    insertHtml (html) {
      const range = document.getSelection().getRangeAt(0)
      const fragment = document.createRange().createContextualFragment(html)
      range.insertNode(fragment)
    }
  },
  created () {
    // We can not use mousetrap because mousetrap is disable in
    // contenteditable areas.
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault()
        this.surround_('strong')
      } else if (event.ctrlKey && event.key === 'u') {
        event.preventDefault()
        this.surround_('u')
      } else if (event.ctrlKey && event.key === 'l') {
        event.preventDefault()
        this.insertHtml('<ul><li>.</li></ul>')
      } else if (event.ctrlKey && event.key === '1') {
        event.preventDefault()
        this.surround_('h1')
      } else if (event.ctrlKey && event.key === '2') {
        event.preventDefault()
        this.surround_('h2')
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
