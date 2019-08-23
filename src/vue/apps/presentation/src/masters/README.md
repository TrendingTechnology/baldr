
```js
export const master = {
  name: 'markdown',
  centerVertically: true,
  darkMode: false,
  examples: [
    {
      path: 'all',
      title: 'All properties',
      data: {
        text: 'Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.',
        author: 'Johann Wolfgang von Goethe',
        date: 1801
      }
    },
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