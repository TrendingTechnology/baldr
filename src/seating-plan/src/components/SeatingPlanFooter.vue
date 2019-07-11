<template>
  <footer>
    <div class="count">
    Schülerzahl: {{ currentPersonsCount }}
    </div>
    <div class="jobs">
      <span class="job" v-for="(persons, jobName) in jobsOfCurrentGrade" :key="jobName">
        <strong><material-icon disabled :name="getJobIconFromName(jobName)"/> {{ jobName }}:</strong>
        <span v-for="person in persons" :key="person.id">
          {{ person.lastName }},
          {{ person.firstName }}<!--
      --><material-icon
            name="delete"
            @click.native="removePersonFromJob({ personId: person.id, jobName: jobName })"
          />
        </span>
      </span>
    </div>
  </footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'SeatingPlanFooter',
  components: {
    MaterialIcon
  },
  computed: mapGetters(['currentPersonsCount', 'jobsOfCurrentGrade']),
  methods: {
    ...mapActions(['removePersonFromJob']),
    getJobIconFromName (jobName) {
      return this.$store.getters.jobIconFromName(jobName)
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
