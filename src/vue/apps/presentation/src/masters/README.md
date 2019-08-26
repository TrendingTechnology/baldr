
File name: `name.vue`

The master name is: `name`

```js
export const master = {
  centerVertically: true,
  darkMode: false,
  documentation = `# Markdown`,
  examples: [
    {
      path: 'all',
      title: 'All properties',
      data: {
        text: 'Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.',
        author: 'Johann Wolfgang von Goethe',
        date: 1801
      }
    }
  ]
  // result must fit to props
  normalizeData (data) {
    if (typeof data === 'string') {
      return {
        markup: data
      }
    }
  }
}
```