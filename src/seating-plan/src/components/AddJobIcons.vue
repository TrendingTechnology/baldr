<template>
  <span v-if="person.id" class="jobs">
    <span v-for="job in listJobs" :key="job.name">
      <material-icon
        v-if="!hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="eventListenerAddPersontoJob(person.id, job.name)"
      />
    </span>
  </span>
</template>

<script>
import MaterialIcon from './MaterialIcon.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'AddJobIcons',
  components: { MaterialIcon },
  props: {
    person: [Object, Boolean]
  },
  computed: mapGetters(['listJobs']),
  methods: {
    eventListenerAddPersontoJob (personId, jobName) {
      this.$store.dispatch('addPersonToJob', { personId, jobName })
    },
    hasPersonJob (personId, jobName) {
      return this.$store.getters.hasPersonJob(personId, jobName)
    }
  }

}
</script>
