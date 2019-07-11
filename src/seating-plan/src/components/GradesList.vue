<template>
  <ul class="grades-list">
    <li v-for="gradeName in gradeNames" :key="gradeName">
      <router-link :to="'/grade/' + gradeName">
        {{ gradeName }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GradesList',
  computed: mapGetters(['gradeNames'])
}
</script>
