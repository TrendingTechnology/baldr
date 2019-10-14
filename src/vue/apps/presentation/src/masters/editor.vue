<template>
  <div
    class="editor-master"
    spellcheck="false"
    v-html="markup"
    :style="{ fontSize: fontSize + 'vw' }">
  </div>
</template>

<script>
let editorId = 0

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
`

export const master = {
  styleConfig: {
    centerVertically: false,
    overflow: false,
    theme: 'handwriting'
  },
  example,
  normalizeProps (props) {
    let propsNormalized = {}
    if (typeof props === 'boolean') {
      // Somehow two editor slides get the same edited content.
      editorId += 1
      propsNormalized.markup = `<p class="editor-${editorId}" contenteditable>x</p>`

    } else if (typeof props === 'string') {
      propsNormalized.markup = props
    } else {
      propsNormalized = props
    }
    propsNormalized.markup = propsNormalized.markup.replace(/>\w*\*\w*</g, ' contenteditable>.<')
    return propsNormalized
  },
  // Called when leaving a slide.
  leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
    const element = document.querySelector('.editor-master')
    if (element) oldProps.markup = element.innerHTML
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
  methods: {
    bold () {
      const selection = window.getSelection()
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0)
        const elStrong = document.createElement('strong')
        range.surroundContents(elStrong)
      }
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
      } else if (event.ctrlKey && event.key === '+') {
        event.preventDefault()
        this.increaseFontSize()
      } else if (event.ctrlKey && event.key === '-') {
        event.preventDefault()
        this.decreaseFontSize()
      }
    })
  }
}
</script>
