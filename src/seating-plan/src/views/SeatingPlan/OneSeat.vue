<template>
  <div
    class="vc_one_seat"
    :id=seat.no
    :style="style"
    :title="person.id"
    :draggable="draggable"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @dragstart="dragStart"
    @drop.prevent="dragDrop"
  >
    <div
      @click="openModalPersonSelect"
      class="person-select-area"
      title="SchülerIn auf diesen Sitz platzieren"
      v-if="!person"
    />
    <div v-if="person" class="first-name">{{ person.firstName }}</div>
    <div v-if="person" class="last-name">{{ person.lastName }}</div>
    <div v-if="person" class="jobs-of-person">
      <persons-jobs :person="person"/>
    </div>
    <div class="icons">
      <add-job-icons :person="person"/>

      <div class="management-icons">
        <material-icon
          class="add"
          v-if="gradeIsNotPlaced"
          name="account-plus"
          title="SchülerIn auf diesen Sitz platzieren"
          @click.native="openModalPersonSelect"
        />
        <material-icon
          v-if="person.id"
          class="close"
          name="close"
          title="SchülerIn aus dem Sitzplan entfernen"
          @click.native="unplacePerson"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import AddJobIcons from '@/components/AddJobIcons'
import PersonsJobs from '@/components/PersonsJobs'

export default {
  name: 'OneSeat',
  components: {
    AddJobIcons,
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
    gradeIsNotPlaced () {
      return !this.$store.getters.isGradePlacedCurrent
    },
    person () {
      return this.$store.getters.personByGradeAndSeatNoCurrent(this.seat.no)
    },
    style () {
      return `bottom: ${this.seat.y}%; height: ${this.seats.dimension.depth}%; left: ${this.seat.x}%; width: ${this.seats.dimension.width}%;`
    }
  },
  methods: {
    dragDrop (event) {
      const personId = event.dataTransfer.getData('text/plain')
      this.$store.dispatch('placePerson', { seatNo: this.seat.no, personId: personId })
      if (event.currentTarget.classList) {
        event.currentTarget.classList.remove('dragover')
      }
    },
    dragLeave (event) {
      if (event.currentTarget.classList) {
        event.currentTarget.classList.remove('dragover')
      }
    },
    dragOver (event) {
      event.currentTarget.classList.add('dragover')
    },
    dragStart (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('text/plain', event.currentTarget.title)
    },
    openModalPersonSelect (event) {
      if (this.person) return
      this.$store.commit('setSeatNoCurrent', this.seat.no)
      this.$modal.show('person-select')
      this.$dynamicSelect.focus()
    },
    unplacePerson (event) {
      this.$store.dispatch('unplacePerson', { personId: this.person.id, seatNo: this.seat.no })
    }
  }
}
</script>

<style lang="scss">
  .vc_one_seat {
    border: 1px solid $black;
    position: absolute;

    &[draggable="true"] {
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

    &.dragover {
      background-color: $red;
      opacity: 0.4;
    }

    .icons {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      right: 0;

      .jobs {
        font-size: 0.8em;
      }
    }

    .icons {
      display: none;
    }

    &:hover .icons {
      display: block;
      cursor: pointer;
    }

    .person-select-area {
      cursor: pointer;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
</style>
