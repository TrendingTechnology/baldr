<template>
  <main>
    <h1>Available icons</h1>
    <table>
      <tr
        v-for="icon in icons"
        :key="icon"
        size="1.5vw"
        :name="icon"
      >
        <td>
          <material-icon size="2vw" :name="icon"/>
        </td>
        <td>{{ icon }}</td>
      </tr>
    </table>

    <h1>Warning</h1>
    <material-icon class="red" size="2vw" name="xxx"/>
  </main>
</template>

<script>
import { icons } from '@bldr/vue-component-material-icon'
export default {
  name: 'MaterialIconView',
  computed: {
    icons () {
      return icons
    }
  }
}
</script>
