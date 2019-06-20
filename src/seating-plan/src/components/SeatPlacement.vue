<template>
  <div class="seat"
       :id=seatWidth
       :style="style"
       :title="personId"
       @dragover.prevent="eventListenerDragOver"
       @dragleave.prevent="eventListenerDragLeave"
       @dragstart="eventListenerDragStart"
       @drop.prevent="eventListenerDrop"
  >
    <div class="first-name">{{ personFirstName }}</div>
    <div class="last-name">{{ personLastName }}</div>
    <div class="no">{{ seat.no }}</div>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
let seats = dataStore.getData().seats

export default {
  name: 'Seat-Placement',
  props: {
    seat: Object,
  },
  computed: {
    style () {
      return `bottom: ${this.seat.y}%; height: ${seats.dimension.depth}%; left: ${this.seat.x}%; width: ${seats.dimension.width}%;`;
    },
    personFirstName () {
      return this.seat.person.firstName
    },
    personLastName () {
      return this.seat.person.lastName
    },
    personId () {
      return this.seat.person.id
    },
    people() {
      return this.$root.$data.seatingPlan.people
    },
    seatWidth() {
      return this.$root.$data.seatingPlan.seats.seatWidth
    },
    seatDepth() {
      return this.$root.$data.seatingPlan.seats.seatDepth
    },
    seats () {
      return this.$root.$data.seatingPlan.seats
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
      if (event.currentTarget.classList) event.currentTarget.classList.remove('dragover')
    },
    eventListenerDrop (event) {
      let personId = event.dataTransfer.getData('text/plain')
      let personToBePlaced = this.people.getPersonById(personId)
      personToBePlaced.placed = true
      // Drop over a seat which is already placed a person.
      // Reset the seat number first.
      if (this.seat.person.hasOwnProperty('firstName')) {
        this.seat.person.seatNo = 0
      }
      // Remove person from seat
      if (personToBePlaced.seatNo) {
        this.seats.seats[personToBePlaced.seatNo].person = {}
      }
      // Set new seat number to the person.
      personToBePlaced.seatNo = this.seat.no
      this.seat.person = personToBePlaced
      this.$el.draggable = "true"
      if (event.currentTarget.classList) event.currentTarget.classList.remove('dragover')
    }
  }
}
</script>

<style scoped>
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
</style>
