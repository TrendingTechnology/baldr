<template>
  <div class="footer">
    SchülerInnen: {{ personsCount }}
    plaziert: {{ placedPersonsCount }}

    <span v-for="(names, jobName) in jobs" :key="jobName">
      <strong>{{ jobName }}:</strong>
      <span v-for="name in names" :key="name">
        {{ name }}
      </span>
    </span>
  </div>
</template>

<script>
import dataStore from '../data-store.js'

export default {
  name: 'SeatingPlanFooter',
  computed: {
    personsCount () {
      return dataStore.getCurrentPersonsCount()
    },
    placedPersonsCount () {
      return dataStore.getCurrentPlacedPersonsCount()
    },
    jobs () {
      return dataStore.getJobsPerGrade()
    }
  }
}
</script>

<style scoped>
</style>
