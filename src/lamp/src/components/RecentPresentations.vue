<template>
  <ul v-if="recentPresentations" class="vc_recent_presentations">
    <li v-for="presInfo in recentPresentations" :key="presInfo.presId">
      {{ presInfo.title }}
    </li>
  </ul>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('lamp')

export default {
  name: 'RecentPresentations',
  computed: mapGetters(['recentPresentations']),
  methods: mapActions(['readRecentPresentations']),
  mounted () {
    if (!this.recentPresentations) {
      this.readRecentPresentations()
    }
  }
}
</script>
