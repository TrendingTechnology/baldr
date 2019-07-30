<template>
  <main class="start-page">
    <h2>Sitzpläne</h2>
    <grades-overview/>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import GradesOverview from './GradesOverview'

export default {
  name: 'StartPage',
  components: {
    GradesOverview
  },
  computed: mapGetters(['gradeNames']),
  methods: mapActions(['createTestData'])
}
</script>
