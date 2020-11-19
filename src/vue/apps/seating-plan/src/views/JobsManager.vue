<template>
  <main class="vc_jobs_manager">
    <ul>
      <li v-for="job in jobsAsArray" :key="job.name">
        <material-icon disabled :name="job.icon"/>
        {{ job.name }}
        <material-icon name="delete" @click.native="deleteJob(job.name)"/>
      </li>
    </ul>
    <form @submit.prevent="createJob">
      <label>
        Name:
        <input ref="name" type="text" v-model="newName" @keyup.enter="createJob"/>
      </label>
      <label>
        Icon:
        <input ref="icon" type="text" v-model="newIcon" @keyup.enter="createJob"/>
      </label>
      <button>hinzufügen</button>
    </form>
  </main>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  computed: mapGetters([
    'jobsAsArray'
  ])
})
export default class JobsManager extends Vue {
  newName: string = ''

  newIcon: string = ''

  createJob () {
    if (this.newName && this.newIcon) {
      this.$store.dispatch('createJob', { name: this.newName, icon: this.newIcon })
      this.newName = ''
      this.newIcon = ''
    }
  }

  deleteJob (name: string) {
    this.$store.dispatch('deleteJob', name)
  }
}
</script>
