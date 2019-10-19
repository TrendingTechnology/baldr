
File name: `name.vue`

The master name is: `name`

```js
export const master = {
  title: 'Bild',
  icon: 'file-image',
  color: 'green',
  styleConfig: {
    centerVertically: true,
    darkMode: false,
    overflow: false,
    slidePadding: '4vw',
    theme: 'default'
  },
  documentation = `# Markdown`,
  example: `
slides:
- title: 'URL: id:'
  image:
    src: id:Haydn
`,
  store: {
    getters,
    actions,
    mutations
  },
  // result must fit to props
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        markup: props
      }
    }
  },
  stepCount (props) {
    return props.src.length
  },
  // An array of media URIs to resolve (like [id:beethoven, filename:mozart.mp3])
  resolveMediaUris (props) {
    return props.src
  },
  plainTextFromProps (props) {
  },
  // Called when entering a slide.
  enterSlide ({ oldSlide, oldProps, newSlide, newProps }) {
  },
  // Called when leaving a slide.
  leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
  }
  // Called when entering a step.
  enterStep ({ oldStepNo, newStepNo }) {
  },
  // Called when leaving a step.
  leaveStep ({ oldStepNo, newStepNo }) {
  }
}
```