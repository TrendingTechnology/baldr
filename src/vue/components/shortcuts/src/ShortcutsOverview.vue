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
        <tr v-for="shortcut in shortcuts" :key="shortcut.keys">
          <td>{{ shortcut.keys }}</td>
          <td class="description">{{ shortcut.description }}</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ShortcutsOverview',
  computed: mapGetters(['shortcuts'])
}
</script>

<style lang="scss" scoped>
  .shortcuts-overview {
    font-size: 1.8vw;

    .description {
      font-style: italic;
    }
  }
</style>
