<template>
  <div class="people-list">
    <dynamic-select
      :options="persons"
      option-value="id"
      option-text="lastName"
      v-model="selectedPerson"
      @input="eventListenerSearch"
    />
    <ol>
      <people-item v-for="person in persons"
                  :person="person"
                  :key="person.id"
      />
    </ol>
  </div>

</template>

<script>
import PeopleItem from './PeopleItem.vue'
import DynamicSelect from './DynamicSelect.vue'
import dataStore from '../data-store.js'

export default {
  name: 'PeopleList',
  components: {
    PeopleItem,
    DynamicSelect
  },
  data () {
    return {
      selectedPerson: ''
    }
  },
  computed: {
    persons () {
      return dataStore.getPersons(dataStore.getCurrentGrade())
    }
  },
  methods: {
    eventListenerSearch () {
      console.log(this.selectedPerson)
    }
  }
}
</script>

<style scoped>
  .people-list {
    display: block;
    white-space: nowrap;
  }
</style>
