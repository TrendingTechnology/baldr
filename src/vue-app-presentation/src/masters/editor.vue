<template>
  <div
    class="vc_editor_master"
    spellcheck="false"
    v-html="markupSafe"
    :style="{ fontSize: fontSize + 'vw' }">
  </div>
</template>

<script>
import { plainText } from '@bldr/core-browser'
import { markupToHtml } from '@/lib.js'

let editorId = 0

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const defaultMarkup = `<p class="editor-${editorId}" contenteditable>${placeholderTag}</p>`
const example = `
---
slides:

- editor

- title: Unordered list
  editor: |
    # heading

    - …

- title: Unordered list as HTML
  editor: |
    <ul contenteditable>
      <li>.</li>
    </ul>

- title: Unordered list as HTML with …
  editor: |
    <ul contenteditable>
      <li>…</li>
    </ul>

- title: Show editor
  editor: |
    # heading

    …

- title: Multple ellipsis
  editor: |

    …

    …

- title: Show editor
  editor: true

- title: Show second editor
  editor: true

- title: Markup
  editor:
    markup: |
      <strong>Specifed with prop markup</strong>:

      …

- title: Markup as string
  editor: |
    <strong>Markup as string</strong>:

    …

- title: 'HTML: <ul>'
  editor: |
    <ul>
      <li>…</li>
    </ul>

- title: 'HTML: <table>'
  editor: |
    <table>
      <thead>
        <tr>
          <td>Musikalische Merkmale</td>
          <td>Interpretation</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>…</td>
          <td>…</td>
        </tr>
      </tbody>
    </table>

- title: 'HTML: <table> replace … with contenteditable'
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
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Rhythmik</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Satztechnik</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Artikulation</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Tonlage</th>
          <td>…</td>
          <td>…</td>
        </tr>
      </tbody>
    </table>

- title: 'Markdown'
  editor: |
    # heading 1

    lorem **ipsum** lorem

    …
`

export const master = {
  title: 'Hefteintrag',
  icon: {
    name: 'pencil',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: false,
    overflow: false,
    contentTheme: 'handwriting'
  },
  example,
  normalizeProps (props) {
    let norm = {}
    // Somehow two editor slides get the same edited content.
    editorId += 1

    if (typeof props === 'boolean') {
      norm.markup = '<div>…</div>'
    } else if (typeof props === 'string') {
      norm.markup = props
    } else {
      norm = props
    }

    norm.markup = markupToHtml(norm.markup)
    norm.markup = norm.markup.replace(
      />…</g,
      ` class="editor-${editorId}" contenteditable>${placeholderTag}<`
    )
    return norm
  },
  leaveSlide ({ oldProps }) {
    const element = document.querySelector('.vc_editor_master')
    if (element) oldProps.markup = element.innerHTML
  },
  plainTextFromProps (props) {
    return plainText(props.markup)
  }
}

export default {
  props: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    }
  },
  data () {
    return {
      fontSize: 3.5
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
      )}
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
    insertHtml(html) {
      const range = document.getSelection().getRangeAt(0)
      const fragment = document.createRange().createContextualFragment(html)
      range.insertNode(fragment)
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
    this.onSlideChange()
  },
  updated () {
    this.onSlideChange()
  }
}
</script>

<style lang="scss">
  .vc_editor_master {
    // left right padding more because of ul ol etc ...
    padding: 2vw 5vw;
    // Font size is set by a data property.
    // font-size: 3.5vw;

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
