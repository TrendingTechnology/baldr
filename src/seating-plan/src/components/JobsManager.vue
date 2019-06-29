<template>
  <div class="jobs-manager">
    <heading-title title="Dienste verwalten"/>
    <ul v-for="job in jobs" :key="job">
      <li>{{ job }} <span class="mdi mdi-delete" @click="deleteJob(job)"></span></li>
    </ul>
    <input ref="inputField" type="text" v-model="newJob" @keyup.enter="addJob()"/>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'JobsManager',
  components: {
    HeadingTitle
  },
  data: function () {
    return {
      newJob: ''
    }
  },
  computed: {
    jobs () {
      return dataStore.getData().jobs
    }
  },
  methods: {
    addJob () {
      dataStore.addJob(this.newJob)
      this.$nextTick(() => {
        this.$refs.inputField.value = ''
      })
    },
    deleteJob (job) {
      dataStore.deleteJob(job)
    }
  }
}
</script>
