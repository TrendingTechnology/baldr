<template>
  <div class="seat"
       :id=seat.no
       :style="style"
       :title="personId"
       :draggable="draggable"
       @dragover.prevent="eventListenerDragOver"
       @dragleave.prevent="eventListenerDragLeave"
       @dragstart="eventListenerDragStart"
       @drop.prevent="eventListenerDrop"
  >
    <div class="first-name">{{ personFirstName }}</div>
    <div class="last-name">{{ personLastName }}</div>
    <div class="no">{{ seat.no }}</div>
    <div class="close mdi mdi-close" @click="eventListenerRemove"></div>
    <div class="add mdi mdi-account-plus" @click="eventListenerAdd"></div>
  </div>
</template>

<script>
// import '@mdi/font'
import dataStore from '../data-store.js'
let seats = dataStore.getData().seats

export default {
  name: 'OneSeat',
  props: {
    seat: Object
  },
  computed: {
    draggable () {
      if (this.person.seatNo >= 1 && this.person.seatNo <= seats.count) {
        return 'true'
      } else {
        return 'false'
      }
    },
    style () {
      return `bottom: ${this.seat.y}%; height: ${seats.dimension.depth}%; left: ${this.seat.x}%; width: ${seats.dimension.width}%;`
    },
    person () {
      return dataStore.getPersonBySeatNo(this.seat.no)
    },
    personFirstName () {
      if (this.person) {
        return this.person.firstName
      } else {
        return ''
      }
    },
    personLastName () {
      if (this.person) {
        return this.person.lastName
      } else {
        return ''
      }
    },
    personId () {
      if (this.person) {
        return this.person.id
      } else {
        return ''
      }
    }
  },
  methods: {
    eventListenerDragStart (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('text/plain', event.currentTarget.title)
    },
    eventListenerDragOver (event) {
      event.currentTarget.classList.add('dragover')
    },
    eventListenerDragLeave (event) {
      if (event.currentTarget.classList) {
        event.currentTarget.classList.remove('dragover')
      }
    },
    eventListenerDrop (event) {
      let personId = event.dataTransfer.getData('text/plain')
      dataStore.placePersonById(this.seat.no, personId)
      if (event.currentTarget.classList) {
        event.currentTarget.classList.remove('dragover')
      }
    },
    eventListenerRemove (event) {
      dataStore.removePersonFromSeat(this.personId, this.seat.no)
    },
    eventListenerAdd (event) {
      dataStore.setCurrentSeat(this.seat.no)
      dataStore.data.showModalPersonSelect = true
      this.$nextTick(() => {
        document.querySelector('.dynamic-select').focus()
      })
    }
  }
}
</script>

<style scoped>
  @import '../../node_modules/@mdi/font/css/materialdesignicons.css';

  .seat {
    border: 1px solid black;
    position: absolute;
    background-color: white;
  }
  [draggable="true"] {
    cursor: grab;
  }
  .first-name {
    font-weight: bold;
    text-align: center;
  }
  .last-name {
    font-style: italic;
    text-align: center;
  }
  .no {
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0.2;
  }
  .dragover {
    background-color: red;
  }

  /* close */
  .seat .close {
    position: absolute;
    bottom: 0;
    right: 0;
    display: none;
  }
  .seat[title]:hover .close {
    display: block;
    cursor: pointer;
  }

  /* add */
  .seat .add {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .seat:not([title]) .add {
    display: block;
  }

  .seat[title] .add {
    display: none;
  }
</style>
