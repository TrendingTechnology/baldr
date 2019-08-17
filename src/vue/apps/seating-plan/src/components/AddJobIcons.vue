<template>
  <span v-if="person.id" class="jobs">
    <span v-for="job in jobsAsArray" :key="job.name">
      <material-icon
        v-if="!hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="addJobToPerson({ personId: person.id, jobName: job.name})"
      />
    </span>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AddJobIcons',
  props: {
    person: [Object, Boolean]
  },
  computed: mapGetters([
    'jobsAsArray'
  ]),
  methods: {
    ...mapActions([
      'addJobToPerson'
    ]),
    hasPersonJob (personId, jobName) {
      return this.$store.getters.hasPersonJob(personId, jobName)
    }
  }
}
</script>
