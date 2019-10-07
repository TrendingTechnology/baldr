<template>
  <div class="rest-api-overview">
    <h1>REST API servers</h1>

    <table>
      <thead>
        <tr>
          <th>URL</th>
          <th>Version</th>
          <th>Assets</th>
          <th>Presentations</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="server in this.restApiServers"
          :key="server.baseUrl"
        >
          <td>{{ server.baseUrl }}</td>
          <td>{{ server.version }}</td>
          <td>{{ server.count.assets }}</td>
          <td>{{ server.count.presentations }}</td>
          <td>{{ server.update }}</td>
        </tr>
      </tbody>

    </table>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'RestApiOverview',
  computed: mapGetters(['restApiServers']),
  created () {
    this.$store.dispatch('media/setRestApiServers')
  }
}
</script>

<style lang="scss" scoped>
  .rest-api-overview {
    font-size: 2vw;

    td, th {
      padding: 0 0.5em;
    }
  }
</style>
