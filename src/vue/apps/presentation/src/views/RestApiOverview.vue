<template>
  <div class="rest-api-overview">
    <h1>REST API servers</h1>

    <ol>
      <li
        v-for="server in this.restApiServers"
        :key="server.baseURL"
      >{{ server.baseURL }}</li>
    </ol>

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
