<template>
  <div class="jobs-manager">
    <heading-title title="Dienste verwalten"/>
    <ul>
      <li v-for="job in jobs" :key="job.name">
        <material-icon disabled :name="job.icon"/>
        {{ job.name }}
        <material-icon name="delete" @click.native="deleteJob(job.name)"/>
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
import HeadingTitle from './HeadingTitle.vue'
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'JobsManager',
  components: {
    HeadingTitle, MaterialIcon
  },
  data: function () {
    return {
      newName: '',
      newIcon: ''
    }
  },
  computed: {
    jobs () {
      return this.$store.getters['listJobs']
    }
  },
  methods: {
    addJob () {
      if (this.newName && this.newIcon) {
        this.$store.dispatch('addJob', { name: this.newName, icon: this.newIcon })
        this.$nextTick(() => {
          this.$refs.name.value = ''
          this.$refs.icon.value = ''
        })
      }
    },
    deleteJob (name) {
      this.$store.dispatch('deleteJob', name)
    }
  }
}
</script>
