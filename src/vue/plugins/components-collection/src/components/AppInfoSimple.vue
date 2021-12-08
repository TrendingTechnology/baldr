<template>
  <div class="vc_about_page">
    <h2>Über die App „{{ packageName }}“</h2>

    <table>
      <tbody>
        <tr>
          <th>Paket-Name</th>
          <td>
            <a :href="`https://www.npmjs.com/package/${packageName}`">
              {{ packageName }}
            </a>
          </td>
        </tr>
        <tr>
          <th>Paket-Version</th>
          <td>
            <a :href="`https://www.npmjs.com/package/${packageName}`">
              {{ version }}
            </a>
          </td>
        </tr>
        <tr>
          <th>Git-Version</th>
          <td>
            <a
              :href="
                `https://github.com/Josef-Friedrich/baldr/commit/${gitHead.long}`
              "
            >
              {{ gitHead.short }}<span v-if="gitHead.isDirty">-dirty</span>
            </a>
          </td>
        </tr>
        <tr>
          <th>Zeitpunkt der Kompilierung</th>
          <td>{{ compilationTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* globals compilationTime gitHead */
import { MaterialIcon } from '@bldr/icons'

export default {
  name: 'AppInfoSimple',
  props: {
    packageName: {
      required: true,
      type: String
    },
    version: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      gitHead: gitHead,
      compilationTime: new Date(compilationTime).toLocaleString()
    }
  }
}
</script>

<style lang="scss" scoped>
.vc_about_page {
}
</style>
