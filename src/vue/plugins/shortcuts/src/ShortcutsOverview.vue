<template>
  <div class="vc_shortcuts_overview" b-ui-theme="default">
    <!-- <h1>Shortcuts</h1> -->
    <h1>Tastenkürzel</h1>

    <table>
      <thead>
        <tr>
          <!-- <td>Keys</td> -->
          <td>Tastenkürzel</td>
          <!-- <td>Description</td> -->
          <td>Beschreibung</td>
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
export default {
  name: 'ShortcutsOverview',
  computed: {
    shortcutsAll () {
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

<style lang="scss">
.vc_shortcuts_overview {
  box-sizing: border-box;
  font-size: 1.8vw;
  height: 100vh;
  padding: 4vw;
  width: 100vw;
  overflow-x: hidden;

  table {
    margin: 0 auto;
  }

  .description {
    font-style: italic;
  }

  td {
    padding: 0 0.3em;
  }

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
