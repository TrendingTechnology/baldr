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
import { mapGetters, mapActions } from 'vuex'

// Components
import GradesTable from './GradesTable'

export default {
  name: 'GradesOverview',
  computed: mapGetters(['gradeNames', 'isGradePlaced']),
  components: {
    GradesTable
  },
  data: function () {
    return {
      gradeName: ''
    }
  },
  methods: {
    ...mapActions(['deleteGrade']),
    createGrade () {
      if (this.gradeName) {
        this.$store.dispatch('createGrade', this.gradeName)
        this.gradeName = ''
      }
    }
  }
}
</script>
