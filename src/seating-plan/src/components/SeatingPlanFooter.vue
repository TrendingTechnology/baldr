<template>
  <footer>
    <div class="count">
    Schülerzahl: {{ getCurrentPersonsCount }}
    </div>
    <div class="jobs">
      <span class="job" v-for="(persons, jobName) in getJobsOfCurrentGrade" :key="jobName">
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
import MaterialIcon from './MaterialIcon.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SeatingPlanFooter',
  components: {
    MaterialIcon
  },
  computed: mapGetters(['getCurrentPersonsCount', 'getJobsOfCurrentGrade']),
  methods: {
    removePersonFromJob (personId, jobName) {
      this.$store.dispatch('removePersonFromJob', { personId, jobName })
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
