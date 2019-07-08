<template>
  <div class="persons-jobs">
    <span v-for="job in listJobs" :key="job.name">
      <material-icon
        v-if="hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="eventListenerRemovePersonFromJob(person.id, job.name)"
      />
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'PersonsJob',
  props: {
    person: Object
  },
  components: { MaterialIcon },
  computed: mapGetters(['listJobs']),
  methods: {
    eventListenerRemovePersonFromJob (personId, jobName) {
      this.$store.dispatch('removePersonFromJob', { personId, jobName })
    },
    hasPersonJob (personId, jobName) {
      return this.$store.getters.hasPersonJob(personId, jobName)
    }
  }
}
</script>

<style scoped>
  .persons-jobs {
    display: inline-block;
  }
</style>
