<template>
  <div
    class="seat"
    :id=seat.no
    :style="style"
    :title="person.id"
    :draggable="draggable"
    @dragover.prevent="eventListenerDragOver"
    @dragleave.prevent="eventListenerDragLeave"
    @dragstart="eventListenerDragStart"
    @drop.prevent="eventListenerDrop"
  >
    <div class="first-name">{{ person.firstName }}</div>
    <div class="last-name">{{ person.lastName }}</div>
    <div class="jobs-of-person">
      <persons-jobs :person="person"/>
    </div>
    <div class="icons">
      <material-icon class="add" v-if="gradeIsNotPlaced" name="account-plus" @click.native="eventListenerAdd"/>
      <add-job-icons :person="person"/>
      <material-icon v-if="person.id" class="close" name="close" @click.native="eventListenerRemove"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import AddJobIcons from '@/components/AddJobIcons'
import MaterialIcon from '@/components/MaterialIcon'
import PersonsJobs from './PersonsJobs'

export default {
  name: 'OneSeat',
  components: {
    AddJobIcons,
    MaterialIcon,
    PersonsJobs
  },
  props: {
    seat: Object
  },
  computed: {
    ...mapGetters([
      'jobsAsArray',
      'seats'
    ]),
    draggable () {
      if (this.person.seatNo >= 1 && this.person.seatNo <= this.seats.count) {
        return 'true'
      }
      return 'false'
    },
    style () {
      return `bottom: ${this.seat.y}%; height: ${this.seats.dimension.depth}%; left: ${this.seat.x}%; width: ${this.seats.dimension.width}%;`
    },
    person () {
      return this.$store.getters.personByGradeAndSeatNoCurrent(this.seat.no)
    },
    gradeIsNotPlaced () {
      return !this.$store.getters.isGradePlacedCurrent
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
      this.$store.dispatch('placePerson', { seatNo: this.seat.no, personId: personId })
      if (event.currentTarget.classList) {
        event.currentTarget.classList.remove('dragover')
      }
    },
    eventListenerRemove (event) {
      this.$store.dispatch('unplacePerson', { personId: this.person.id, seatNo: this.seat.no })
    },
    eventListenerAdd (event) {
      this.$store.commit('setSeatNoCurrent', this.seat.no)
      this.$store.dispatch('showModal')
      this.$nextTick(() => {
        document.querySelector('.dynamic-select').focus()
      })
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

  .jobs-of-person {
    text-align: center;
  }

  .dragover {
    background-color: red;
  }

  .icons {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .seat .icons {
    display: none;
  }

  .seat:hover .icons {
    display: block;
    cursor: pointer;
  }
</style>
