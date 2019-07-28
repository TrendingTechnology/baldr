<template>
  <div class="start-page">
    <h2>Sitzpläne</h2>
    <grades-list/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import GradesList from './GradesList.vue'

export default {
  name: 'StartPage',
  components: {
    GradesList
  },
  computed: mapGetters(['gradeNames']),
  methods: mapActions(['createTestData'])
}
</script>
