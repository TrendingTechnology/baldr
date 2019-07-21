<template>
  <div class="grades-list">
    <grades-items delete-icons/>
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
import GradesItems from './GradesItems.vue'

export default {
  name: 'GradesList',
  computed: mapGetters(['gradeNames', 'isGradePlaced']),
  components: { GradesItems },
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
