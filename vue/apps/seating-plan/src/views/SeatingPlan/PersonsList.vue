<template>
  <ol class="vc_persons_list">
    <persons-list-item
      v-for="(person, index) in personsByGradeAsListSortedCurrent"
      :person="person"
      :no="index + 1"
      :key="person.id"
    />
  </ol>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import PersonsListItem from './PersonsListItem.vue'

@Component({
  components: {
    PersonsListItem
  },
  computed: mapGetters(['personsByGradeAsListSortedCurrent'])
})
export default class PersonsTable extends Vue {}
</script>

<style lang="scss">
.vc_persons_list {
  font-size: 1.2vw;
  padding-left: 3vw;
  padding-right: 1vw;
}
</style>
