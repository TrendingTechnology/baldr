<template>
  <ul>
    <li v-for="gradeName in gradeNames" :key="gradeName">
      <router-link
        :class="{placed: isGradePlaced(gradeName)}"
        :to="'/grade/' + gradeName"
      >
        {{ gradeName }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GradesItems',
  computed: mapGetters([
    'gradeNames',
    'isGradePlaced'
  ])
}
</script>

<style scoped>
  .placed {
    text-decoration: line-through;
    color: grey;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding-left: 0;
    overflow: hidden;
  }
  ul li {
    float: left;
    padding: 0 0.3em;
  }
</style>
