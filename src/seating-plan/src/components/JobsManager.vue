<template>
  <div class="jobs-manager">
    <ul>
      <li v-for="job in jobsAsArray" :key="job.name">
        <material-icon disabled :name="job.icon"/>
        {{ job.name }}
        <material-icon name="delete" @click.native="deleteJob(job.name)"/>
      </li>
    </ul>
    <form @submit="createJob">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'JobsManager',
  components: {
    MaterialIcon
  },
  data: function () {
    return {
      newName: '',
      newIcon: ''
    }
  },
  computed: mapGetters(['jobsAsArray']),
  methods: {
    createJob () {
      if (this.newName && this.newIcon) {
        this.$store.dispatch('createJob', { name: this.newName, icon: this.newIcon })
        this.newName = ''
        this.newIcon = ''
      }
    },
    deleteJob (name) {
      this.$store.dispatch('deleteJob', name)
    }
  }
}
</script>
