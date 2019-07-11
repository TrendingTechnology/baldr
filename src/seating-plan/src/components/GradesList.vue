<template>
  <div class="grades-list">
    <ul>
      <li v-for="gradeName in gradeNames" :key="gradeName">
        <router-link :to="'/grade/' + gradeName">
          {{ gradeName }}
        </router-link>
      </li>
    </ul>

    <input v-model="gradeName" type="text" placeholder="Klasse">
    <button @click="addGrde">hinzufügen</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GradesList',
  computed: mapGetters(['gradeNames']),
  data: function () {
    return {
      gradeName: ''
    }
  },
  methods: {
    addGrade () {
      if (this.gradeName) {
        this.$store.dispatch('addGrade', { firstName: this.firstName, lastName: this.lastName, grade: this.currentGrade })
        this.gradeName = ''
      }
    }
  }
}
</script>
