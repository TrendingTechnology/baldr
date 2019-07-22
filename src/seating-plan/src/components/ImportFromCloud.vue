<template>
  <div>
    <heading-title title="Aus der Cloud importieren"/>
    <ul>
      <li v-for="date in savedStatesDates" :key="date">
        {{ date }}
      </li>
    </ul>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

// Components
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'ImportFromCloud',
  components: {
    HeadingTitle
  },
  computed: mapGetters(['savedStatesDates']),
  beforeCreate: function () {
    this.$store.dispatch('fetchSavedStatesDates')
  }
}
</script>
