<template>
  <div v-if="person.id" class="vc_add_job_icons">
    <span v-for="job in jobsAsArray" :key="job.name">
      <material-icon
        v-if="!hasPersonJob(person.id, job.name)"
        :name="job.icon"
        :title="job.name"
        @click.native="
          addJobToPerson({ personId: person.id, jobName: job.name })
        "
      />
    </span>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  mapGetters,
  mapActions
} from '@bldr/vue-packages-bundler'
import { Person } from '../types'

@Component({
  computed: mapGetters(['jobsAsArray']),
  methods: {
    ...mapActions(['addJobToPerson'])
  }
})
export default class AddJobIcons extends Vue {
  @Prop()
  person!: Person

  hasPersonJob (personId: string, jobName: string) {
    return this.$store.getters.hasPersonJob(personId, jobName)
  }
}
</script>
