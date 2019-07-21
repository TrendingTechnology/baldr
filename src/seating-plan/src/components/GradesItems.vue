<template>
  <ul :class="{ inline: inline }" >
    <li v-for="gradeName in gradeNames" :key="gradeName">
      <router-link :class="{placed: isGradePlaced(gradeName)}" :to="'/grade/' + gradeName">
        {{ gradeName }}
      </router-link>
      <material-icon
        v-if="deleteIcons"
        name="delete"
        @click.native="deleteGrade(gradeName)"
      />
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'GradesItems',
  props: {
    deleteIcons: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  computed: mapGetters(['gradeNames', 'isGradePlaced']),
  components: { MaterialIcon },
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

<style scoped>
  .placed {
    text-decoration: line-through;
    color: grey;
  }
  ul.inline {
    list-style-type: none;
    margin: 0;
    padding-left: 0;
    overflow: hidden;
  }
  ul.inline li {
    float: left;
    padding: 0 0.3em;
  }
</style>
