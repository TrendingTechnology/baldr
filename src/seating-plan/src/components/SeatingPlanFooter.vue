<template>
  <footer>
    <div class="count">
    Schülerzahl: {{ personsCount }}
    </div>
    <div class="jobs">
      <span class="job" v-for="(persons, jobName) in jobs" :key="jobName">
        <strong>{{ jobName }}:</strong>
        <span v-for="person in persons" :key="person.id">
          {{ person.lastName }},
          {{ person.firstName }}<!--
      --><material-icon
            name="delete"
            @click.native="removePersonFromJob(person.id, jobName)"
          />
        </span>
      </span>
    </div>
  </footer>
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

<style scoped>
  footer {
    display: flex;
  }

  .count {
    padding-right: 3em;
    flex-grow: 1;
  }

  .jobs {
    text-align: right;
  }

  .job {
    padding-left: 1em;
    font-size: 0.9em
  }

  .mdi {
    font-size: 0.8em;
  }
</style>
