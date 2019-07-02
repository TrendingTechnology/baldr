<template>
  <div class="footer">
    SchülerInnen: {{ personsCount }}
    plaziert: {{ placedPersonsCount }}

    <span v-for="(persons, jobName) in jobs" :key="jobName">
      <strong>{{ jobName }}:</strong>
      <span v-for="person in persons" :key="person.id">
        {{ person.lastName }}, {{ person.firstName }}
        <material-icon
          name="delete"
          @click.native="removePersonFromJob(person.id, jobName)"
        />
      </span>
    </span>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'SeatingPlanFooter',
  components: {
    MaterialIcon
  },
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
  },
  methods: {
    removePersonFromJob (personId, jobName) {
      dataStore.removePersonFromJob(personId, jobName)
    }
  }
}
</script>
