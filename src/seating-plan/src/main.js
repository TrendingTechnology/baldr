import Vue from 'vue'
import App from './App.vue'
import dataStore from './data-store.js'
import VueRouter from 'vue-router'

// https://realnamecreator.alexjonas.de/?l=de#
let peopleList = [
  // 1b
  { firstName: 'Nicolas', lastName: 'Wagenknecht', grade: '1b' },
  { firstName: 'Cornelia', lastName: 'Fierek', grade: '1b' },
  { firstName: 'Volker', lastName: 'Englisch', grade: '1b' },
  { firstName: 'Hannah', lastName: 'Fenske', grade: '1b' },
  { firstName: 'Alena', lastName: 'Röhner', grade: '1b' },
  { firstName: 'Katrin', lastName: 'Knospe', grade: '1b' },
  { firstName: 'Angelina', lastName: 'Hüttner', grade: '1b' },
  // 10a
  { firstName: 'Tina', lastName: 'Gaudig', grade: '10a' },
  { firstName: 'Maurice', lastName: 'Grün', grade: '10a' },
  { firstName: 'Alex', lastName: 'Kögel', grade: '10a' },
  { firstName: 'Christine', lastName: 'Stremlau', grade: '10a' },
  { firstName: 'Marlene', lastName: 'Thiem', grade: '10a' },
  { firstName: 'Julius', lastName: 'Bremer', grade: '10a' },
  { firstName: 'Inga', lastName: 'Hochstetter', grade: '10a' },
  { firstName: 'Roswitha', lastName: 'Gscheidle', grade: '10a' },
  { firstName: 'Lothar', lastName: 'Schöttler', grade: '10a' },
  { firstName: 'Axel', lastName: 'Göpfert', grade: '10a' },
  { firstName: 'Mike', lastName: 'Saalbach', grade: '10a' },
  { firstName: 'Nicholas', lastName: 'Enzmann', grade: '10a' },
  { firstName: 'Karin', lastName: 'Beilig', grade: '10a' },
  { firstName: 'Susanne', lastName: 'Delfs', grade: '10a' },
  { firstName: 'Waldemar', lastName: 'Tischer', grade: '10a' },
  { firstName: 'Karl-Heinz', lastName: 'Bandlow', grade: '10a' },
  { firstName: 'Katharina', lastName: 'Weigert', grade: '10a' },
  { firstName: 'Ulrike', lastName: 'Lukin', grade: '10a' },
  { firstName: 'Thorsten', lastName: 'Stüttem', grade: '10a' }
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
]

for (let personFromList of peopleList) {
  dataStore.addPerson(personFromList.firstName, personFromList.lastName, personFromList.grade)
}
dataStore.syncData()

Vue.config.productionTip = false
Vue.use(VueRouter)
new Vue({
  data: function () {
    return {
      data: dataStore.data
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')
