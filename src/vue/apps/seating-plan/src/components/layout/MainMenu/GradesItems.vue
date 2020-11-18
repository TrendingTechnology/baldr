<template>
  <ul class="vc_grades_items">
    <li v-for="gradeName in gradeNames" :key="gradeName">
      <router-link
        :class="{placed: isGradePlaced(gradeName)}"
        :to="{ name: 'seating-plan', params: { grade: gradeName } }"
      >
        {{ gradeName }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  name: 'GradesItems',
  computed: mapGetters([
    'gradeNames',
    'isGradePlaced'
  ])
}
</script>

<style lang="scss">
  .vc_grades_items {
    list-style-type: none;
    margin: 0;
    padding-left: 0;
    overflow: hidden;

    li {
      float: left;
      padding: 0 0.3em;
    }

    .placed {
      text-decoration: line-through;
      color: grey;
    }
  }
</style>
