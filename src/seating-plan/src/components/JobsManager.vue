<template>
  <div class="jobs-manager">
    <heading-title title="Dienste verwalten"/>
    <ul>
      <li v-for="job in jobs" :key="job.name">
        <span :class="'mdi mdi-' + job.icon"></span>
        {{ job.name }}
        <span class="mdi mdi-delete" @click="deleteJob(job.name)"></span>
      </li>
    </ul>
    <label>
      Name:
      <input ref="name" type="text" v-model="newName" @keyup.enter="addJob()"/>
    </label>
    <label>
      Icon:
      <input ref="icon" type="text" v-model="newIcon" @keyup.enter="addJob()"/>
    </label>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import HeadingTitle from './HeadingTitle.vue'
import { mapActions } from 'vuex'

export default {
  name: 'JobsManager',
  components: {
    HeadingTitle
  },
  data: function () {
    return {
      newName: '',
      newIcon: ''
    }
  },
  computed: {
    jobs () {
      return dataStore.listJobs()
    }
  },
  methods: {
    ...mapActions(['addJobX']),
    addJob () {
      if (this.newName && this.newIcon) {
        this.addJobX({ name: this.newName, icon: this.newIcon })
        dataStore.addJob(this.newName, this.newIcon)
        this.$nextTick(() => {
          this.$refs.name.value = ''
          this.$refs.icon.value = ''
        })
      }
    },
    deleteJob (name) {
      dataStore.deleteJob(name)
    }
  }
}
</script>
