<template>
  <footer class="vc_plan_footer">
    <div class="count">Schülerzahl: {{ personsCountCurrent }}</div>
    <div class="jobs">
      <span
        class="job"
        v-for="(persons, jobName) in jobsOfGradeCurrent"
        :key="jobName"
      >
        <strong
          ><material-icon disabled :name="getJobIconFromName(jobName)" />
          {{ jobName }}:</strong
        >
        <span v-for="person in persons" :key="person.id">
          {{ person.lastName }}, {{ person.firstName
          }}<!--
      --><material-icon
            name="delete"
            @click.native="
              removeJobFromPerson({ personId: person.id, jobName: jobName })
            "
          />
        </span>
      </span>
    </div>
  </footer>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  mapGetters,
  mapActions
} from '@bldr/vue-packages-bundler'

@Component({
  computed: mapGetters(['jobsOfGradeCurrent', 'personsCountCurrent']),
  methods: {
    ...mapActions(['removeJobFromPerson'])
  }
})
export default class PlanFooter extends Vue {
  getJobIconFromName (jobName: string) {
    return this.$store.getters.jobIconFromName(jobName)
  }
}
</script>

<style lang="scss">
.vc_plan_footer {
  display: flex;

  .count {
    padding-right: 3em;
    flex-grow: 1;
  }

  .jobs {
    text-align: right;
  }

  .job {
    padding-left: 1em;
    font-size: 0.9em;
  }

  .mdi {
    font-size: 0.8em;
  }
}
</style>
