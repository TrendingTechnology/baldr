<template>
  <span v-if="person.id" class="jobs">
    <span v-for="job in listJobs" :key="job.name">
      <material-icon
        v-if="!hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="addPersonToJob({ personId: person.id, jobName: job.name})"
      />
    </span>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'AddJobIcons',
  components: { MaterialIcon },
  props: {
    person: [Object, Boolean]
  },
  computed: mapGetters(['listJobs']),
  methods: {
    ...mapActions(['addPersonToJob']),
    hasPersonJob (personId, jobName) {
      return this.$store.getters.hasPersonJob(personId, jobName)
    }
  }

}
</script>
