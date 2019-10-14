<template>
  <div class="editor-master mousetrap" spellcheck="false" v-html="markup">
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
`

export const master = {
  styleConfig: {
    centerVertically: false,
    overflow: false,
    theme: 'handwriting'
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'boolean') {
      // Somehow two editor slides get the same edited content.
      editorId += 1
      return {
        markup: `<p contenteditable class="editor-${editorId}">x</p>`
      }
    } else if (typeof props === 'string') {
      return {
        markup: props
      }
    }
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
  methods: {
    bold () {
      const selection = window.getSelection()
      if (selection.rangeCount) {
        console.log(selection)
      }
    }
  },
  created () {
      this.$shortcuts.addMultiple([
      {
        keys: 'ctrl+b',
        callback: () => { this.bold() },
        description: 'bold'
      }
    ])
  }
}
</script>
