<template>
  <div class="vc_persons_jobs">
    <span v-for="job in jobsAsArray" :key="job.name">
      <material-icon
        v-if="hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="removeJobFromPerson({ personId: person.id, jobName: job.name })"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PersonsJob',
  props: {
    person: [Object, Boolean]
  },
  computed: mapGetters([
    'jobsAsArray'
  ]),
  methods: {
    ...mapActions([
      'removeJobFromPerson'
    ]),
    hasPersonJob (personId, jobName) {
      return this.$store.getters.hasPersonJob(personId, jobName)
    }
  }
}
</script>

<style lang="scss">
  .vc_persons_jobs {
    display: inline-block;
  }
</style>
