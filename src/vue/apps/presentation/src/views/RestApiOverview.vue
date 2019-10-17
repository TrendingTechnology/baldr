<template>
  <div class="rest-api-overview">
    <h1>REST API servers</h1>

    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>URL</th>
          <th>Version</th>
          <th>Ass.</th>
          <th>Pres.</th>
          <th>Update</th>
          <th>Commit ID</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(server, index) in this.restApiServers"
          :key="server.baseUrl"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ server.baseUrl }}</td>
          <td>{{ server.version }}</td>
          <td>{{ server.count.assets }}</td>
          <td>{{ server.count.presentations }}</td>
          <td>{{ toLocaleDateTimeString(server.update) }}</td>
          <td>{{ server.commitId.substring(0, 8) }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { toLocaleDateTimeString } from '@bldr/core-browser'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'RestApiOverview',
  computed: mapGetters(['restApiServers']),
  created () {
    this.$store.dispatch('media/setRestApiServers')
  },
  methods: {
    toLocaleDateTimeString
  },
  mounted () {
    this.$styleConfig.set({ centerVertically: false })
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
