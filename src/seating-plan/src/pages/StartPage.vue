<template>
  <main class="start-page">
    <h2>Sitzpläne</h2>
    <grades-list linkAsIcon/>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import GradesList from '@/components/GradesList'

export default {
  name: 'StartPage',
  components: {
    GradesList
  },
  computed: mapGetters(['gradeNames']),
  methods: mapActions(['createTestData'])
}
</script>
