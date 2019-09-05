
File name: `name.vue`

The master name is: `name`

```js
export const master = {
  centerVertically: true,
  darkMode: false,
  slidePadding: '4vw',
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
  }
}
```