<template>
  <div class="start-page">
    <heading-title title="Sitzpläne Musiksaal E 17"/>

    <h2>Sitzpläne</h2>
    <grades-list/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import GradesList from './GradesList.vue'
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'StartPage',
  components: {
    GradesList, HeadingTitle
  },
  computed: mapGetters(['gradeNames']),
  methods: mapActions(['createTestData'])
}
</script>
