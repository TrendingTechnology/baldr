```js
module.exports = {
  commandName: 'mirror <folder>',
  alias: 'm',
  options: [['-help', 'A help message']]
  checkExecutable: 'xdg-open',
  description: 'Create and open in the file explorer a relative path in different base paths.',
  action: function (folder, options) {

  }
}
```
