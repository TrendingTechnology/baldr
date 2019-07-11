<template>
  <div class="persons-jobs">
    <span v-for="job in listJobs" :key="job.name">
      <material-icon
        v-if="hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="removePersonFromJob({ personId: person.id, jobName: job.name })"
      />
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'PersonsJob',
  props: {
    person: [Object, Boolean]
  },
  components: { MaterialIcon },
  computed: mapGetters(['listJobs']),
  methods: {
    ...mapActions(['removePersonFromJob']),
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
