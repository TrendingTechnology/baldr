<template>
  <div
    class="vc_editor_master"
    spellcheck="false"
    v-html="markupSafe"
    :style="{ fontSize: fontSize + 'vw' }">
  </div>
</template>

<script>
import marked from 'marked'
import { plainText } from '@bldr/core-browser'

let editorId = 0

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const defaultMarkup = `<p class="editor-${editorId}" contenteditable>${placeholderTag}</p>`
const example = `
---
slides:

- title: Show editor
  editor: true

- title: Show second editor
  editor: true

- title: Markup
  editor:
    markup: <strong>lol</strong>

- title: Markup as string
  editor: |
    <strong>Markup as string</strong>

- title: 'HTML: <ul>'
  editor: |
    <ul contenteditable>
      <li>x</li>
    </ul>

- title: 'HTML: <table>'
  editor: |
    <table contenteditable>
      <thead>
        <tr>
          <td>Musikalische Merkmale</td>
          <td>Interpretation</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>x</td>
          <td>x</td>
        </tr>
      </tbody>
    </table>

- title: 'HTML: <table> replace * with contenteditable'
  editor: |
    <table>
      <thead>
        <tr>
          <th></th>
          <td>Thema 1 (Spanier)</td>
          <td>Thema 2 (Niederländer)</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Dynamik</th>
          <td>*</td>
          <td>*</td>
        </tr>
        <tr>
          <th>Rhythmik</th>
          <td>*</td>
          <td>*</td>
        </tr>
        <tr>
          <th>Satztechnik</th>
          <td>*</td>
          <td>*</td>
        </tr>
        <tr>
          <th>Artikulation</th>
          <td>*</td>
          <td>*</td>
        </tr>
        <tr>
          <th>Tonlage</th>
          <td>*</td>
          <td>*</td>
        </tr>
      </tbody>
    </table>

- title: 'Markdown'
  editor: |
    # heading 1

    lorem ipsum
`

export const master = {
  title: 'Hefteintrag',
  icon: 'pencil',
  color: 'blue',
  styleConfig: {
    centerVertically: false,
    overflow: false,
    contentTheme: 'handwriting'
  },
  example,
  normalizeProps (props) {
    let propsNormalized = {}
    if (typeof props === 'boolean') {
      // Somehow two editor slides get the same edited content.
      editorId += 1
      propsNormalized.markup = `<p class="editor-${editorId}" contenteditable>${placeholderTag}</p>`
    } else if (typeof props === 'string') {
      propsNormalized.markup = props
    } else {
      propsNormalized = props
    }
    propsNormalized.markup = propsNormalized.markup.replace(/>\w*\*\w*</g, ` contenteditable>${placeholderTag}<`)
    propsNormalized.markup = marked(propsNormalized.markup)
    return propsNormalized
  },
  leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
    const element = document.querySelector('.editor-master')
    if (element) oldProps.markup = element.innerHTML
  },
  plainTextFromProps (props) {
    return plainText(props.markup)
  }
}

export default {
  props: {
    markup: {
      type: String
    }
  },
  data () {
    return {
      fontSize: 2
    }
  },
  computed: {
    markupSafe () {
      if (this.markup) {
        return this.markup
      } else {
        return defaultMarkup
      }
    }
  },
  methods: {
    removePlaceholder () {
      function eventListener (event) {
        const element = event.target
        if (element.innerHTML === placeholderTag) {
          element.innerHTML = ''
        }
      }
      const elements = document.querySelectorAll('.vc_editor_master [contenteditable]')
      for (const element of elements) {
        element.addEventListener('focus', eventListener)
      }
    },
    surround_ (elementName) {
      const selection = window.getSelection()
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0)
        const element = document.createElement(elementName)
        range.surroundContents(element)
      }
    },
    bold () {
      this.surround_('strong')
    },
    underline () {
      this.surround_('u')
    },
    increaseFontSize () {
      this.fontSize += 0.25
    },
    decreaseFontSize () {
      this.fontSize -= 0.25
    }
  },
  created () {
    // We can not use mousetrap because mousetrap is disable in contenteditable areas.
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault()
        this.bold()
      } else if (event.ctrlKey && event.key === 'u') {
        event.preventDefault()
        this.underline()
      } else if (event.ctrlKey && event.key === '+') {
        event.preventDefault()
        this.increaseFontSize()
      } else if (event.ctrlKey && event.key === '-') {
        event.preventDefault()
        this.decreaseFontSize()
      }
    })
  },
  mounted () {
    this.removePlaceholder()
  },
  updated () {
    this.removePlaceholder()
  }
}
</script>

<style lang="scss">
  .vc_editor_master {
    .editor-placeholder {
      font-size: 0.5em;
      color: gray;
      opacity: 0.5;
    }

    [contenteditable] {
      min-height: 1.5em;
    }
  }
</style>