<template>
  <div class="grades-list">
    <ul>
      <li v-for="gradeName in gradeNames" :key="gradeName">
        <router-link :to="'/grade/' + gradeName">
          {{ gradeName }}
        </router-link>
        <material-icon
          name="delete"
          @click.native="deleteGrade(gradeName)"
        />
      </li>
    </ul>

    <input
      v-model="gradeName"
      type="text"
      placeholder="Klasse"
      @keyup.enter="addGrade"
    >
    <button @click="addGrade">hinzufügen</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'GradesList',
  computed: mapGetters(['gradeNames']),
  components: { MaterialIcon },
  data: function () {
    return {
      gradeName: ''
    }
  },
  methods: {
    ...mapActions(['deleteGrade']),
    addGrade () {
      if (this.gradeName) {
        this.$store.dispatch('addGrade', this.gradeName)
        this.gradeName = ''
      }
    }
  }
}
</script>
