<template>
  <div class="vc_rest_api_overview" b-ui-theme="default">
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
          <td>{{ formatToLocalDateTime(server.update) }}</td>
          <td>{{ server.commitId.substring(0, 8) }}</td>
          <td
            @click="updateMediaServer(server.name, $event)"
            title="update"
          >
            <material-icon
              name="update"
            />
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { HttpRequest } from '@bldr/http-request'

import { formatToLocalDateTime } from '@bldr/core-browser'
import { createNamespacedHelpers } from 'vuex'
const httpRequest = new HttpRequest('/api/media')
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'RestApiOverview',
  computed: mapGetters(['restApiServers']),
  created () {
    this.$store.dispatch('media/setRestApiServers')
  },
  methods: {
    formatToLocalDateTime,
    updateMediaServer (endpointName, event) {
      event.target.classList.add('baldr-icon-spin')
      httpRequest.request('mgmt/update', endpointName).then((result) => {
        for (const errorMsg of result.data.errors) {
          this.$notifyError(errorMsg)
        }
        event.target.classList.remove('baldr-icon-spin')
        this.$store.dispatch('media/setRestApiServers')
      })
    }
  }
}
</script>

<style lang="scss">
  .vc_rest_api_overview {
    box-sizing: border-box;
    font-size: 1.6vw;
    height: 100vh;
    padding: 4vw;

    td, th {
      padding: 0 0.5em;
    }

    table {
      width: 100%
    }
  }
</style>
