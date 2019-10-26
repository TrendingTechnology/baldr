<template>
  <div class="grades-list">
    <grades-table/>
    <form @submit="createGrade">
      <input
        @keyup.enter="createGrade"
        placeholder="Klasse"
        type="text"
        size="8"
        v-model="gradeName"
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
