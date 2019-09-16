<template>
  <div class="shortcuts-overview">
    <h1>Shortcuts</h1>

    <table>
      <thead>
        <tr>
          <td>Keys</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="shortcut in shortcutsAll" :key="shortcut.keys">
          <td v-html="keyCombinationToHtml(shortcut.keys)"></td>
          <td class="description">{{ shortcut.description }}</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { keyCombinationToArray } from './index.js'

export default {
  name: 'ShortcutsOverview',
  computed: {
    shortcutsAll() {
      return this.$store.getters['shortcuts/all']
    }
  },
  methods: {
    keyCombinationToHtml (keys) {
      // sequence: a b c
      // combination: a+b
      const sequenceHtml = []
      for (const sequence of keys.split(' ')) {
        const combination = sequence.split('+')
        const combinationHtml = []
        for (const key of combination) {
          combinationHtml.push(`<span class="key">${key}</span>`)
        }
        sequenceHtml.push(combinationHtml.join(' + '))
      }
      return sequenceHtml.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
  .shortcuts-overview {
    font-size: 1.8vw;
    table {
      margin: 0 auto;
    }

    .description {
      font-style: italic;
    }

    td {
      padding: 0 0.3em;
    }
  }
</style>

<style lang="scss" >
  .shortcuts-overview {
    .key {
      background-color: $gray;
      border-radius: 0.1em;
      color: $white;
      display: inline-block;
      font-family: $font-family-mono;
      margin: 0.1em;
      min-width: 2em;
      padding: 0.1em;
      text-align: center;
    }
  }
</style>