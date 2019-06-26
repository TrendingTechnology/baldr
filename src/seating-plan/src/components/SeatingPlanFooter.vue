<template>
  <div class="footer">
    SchülerInnen: {{ personsCount }}
    plaziert: {{ placedPersonsCount }}
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
    }
  }
}
</script>

<style scoped>
</style>
