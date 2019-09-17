<template>
  <div
    class='html-master'
    v-html="markup"
  />

</template>

<script>

const example = `
---
slides:

- title: Heading
  html: |
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>

- title: Lorem ipsum
  html: |
    <p>Lorem ipsum dolor sit amet ...</p>

    <p>consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit
    anim id est laborum.</p>


- title: Ordered list
  html: |
    <ol>
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ol>

- title: Unordered list
  html: |
    <ul>
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ul>
`

export const master = {
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeData (data) {
    if (typeof data === 'string') {
      return {
        markup: data
      }
    }
  }
}

export default {
  props: {
    markup: {
      type: String,
      required: true
    }
  }
}
</script>
