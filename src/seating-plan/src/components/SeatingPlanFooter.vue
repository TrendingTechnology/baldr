<template>
  <div class="footer">
    SchülerInnen: {{ personsCount }}
    plaziert: {{ placedPersonsCount }}

    <span v-for="(persons, jobName) in jobs" :key="jobName">
      <strong>{{ jobName }}:</strong>
      <span v-for="person in persons" :key="person.id">
        {{ person.lastName }}, {{ person.firstName }}
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
