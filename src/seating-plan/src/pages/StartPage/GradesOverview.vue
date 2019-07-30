<template>
  <div class="grades-list">
    <grades-table/>
    <form @submit="createGrade">
      <input
        v-model="gradeName"
        type="text"
        placeholder="Klasse"
        @keyup.enter="createGrade"
      >
      <button>hinzufügen</button>
    </form>
  </div>
</template>

<script>
// Components
import GradesTable from './GradesTable'

export default {
  name: 'GradesOverview',
  components: {
    GradesTable
  },
  data: function () {
    return {
      gradeName: ''
    }
  },
  methods: {
    createGrade () {
      if (this.gradeName) {
        this.$store.dispatch('createGrade', this.gradeName)
        this.gradeName = ''
      }
    }
  }
}
</script>
