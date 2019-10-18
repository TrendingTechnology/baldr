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
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(server, index) in this.restApiServers"
          :key="server.baseUrl"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <a
              target="_blank"
              :href="`${server.baseUrl}/api`"
            >
             {{ server.baseUrl }}
            </a>
          </td>
          <td>{{ server.version }}</td>
          <td>{{ server.count.assets }}</td>
          <td>{{ server.count.presentations }}</td>
          <td>{{ toLocaleDateTimeString(server.update) }}</td>
          <td>{{ server.commitId.substring(0, 8) }}</td>
          <td
            @click="updateMediaServer(server.name)"
            title="update"
          >
            <material-icon name="update"/>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { getDefaultRestEndpoints, HttpRequestNg } from '@bldr/http-request'
const restEndpoints = getDefaultRestEndpoints()
const httpRequestNg = new HttpRequestNg(restEndpoints, '/api/media')

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
    toLocaleDateTimeString,
    updateMediaServer (endpointName) {
      httpRequestNg.request('mgmt/update', endpointName).then((result) => {
        this.$store.dispatch('media/setRestApiServers')
      })
    }
  },
  mounted () {
    this.$styleConfig.set({ centerVertically: false })
  }
}
</script>

<style lang="scss" scoped>
  .rest-api-overview {
    font-size: 1.6vw;

    td, th {
      padding: 0 0.5em;
    }

    table {
      width: 100%
    }
  }
</style>
