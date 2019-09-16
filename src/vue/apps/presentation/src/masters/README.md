
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
`
  // result must fit to props
  normalizeData (data) {
    if (typeof data === 'string') {
      return {
        markup: data
      }
    }
  },
  stepCount (data) {
    return data.src.length
  },
  // An array of media URIs to resolve (like [id:beethoven, filename:mozart.mp3])
  mediaURIs (props) {
    return props.src
  }
}
```