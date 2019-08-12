<template>
<main>
  <table>
    <tr
      v-for="icon in icons"
      :key="icon"
      size="4vw"
      :name="icon"
    >
      <td>
        <material-icon size="2vw" :name="icon"/>
      </td>
      <td>{{ icon }}</td>

    </tr>
  </table>

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
