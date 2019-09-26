
File name: `name.vue`

The master name is: `name`

```js
export const master = {
  styleConfig: {
    centerVertically: true,
    darkMode: false,
    overflow: false,
    slidePadding: '4vw'
  },
  documentation = `# Markdown`,
  example: `
slides:
- title: 'URL: id:'
  image:
    src: id:Haydn_Joseph
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
  // Called when entering a slide.
  enterSlide ({ oldSlide, newSlide }) {
  },
  // Called when leaving a slide.
  leaveSlide ({ oldSlide, newSlide }) {
  }
  // Called when entering a step.
  enterStep ({ oldStepNo, newStepNo }) {
  },
  // Called when leaving a step.
  leaveStep ({ oldStepNo, newStepNo }) {
  }
}
```