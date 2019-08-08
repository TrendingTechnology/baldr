<template>
  <div class="modal-dialog-base" v-show="isVisible">
    <div class="modal-dialog-overlay" @click="hide(name)"/>
    <div class="modal-dialog-container" role="dialog">
      <div class="modal-dialog-body">
        <material-icon class="close" name="close" @click.native="hide(name)"/>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import ModalDialog from './index'

// Components
import { MaterialIcon } from '@bldr/vue-components'

export default {
  name: 'ModalDialog',
  components: {
    MaterialIcon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isVisible: false
    }
  },
  mounted () {
    ModalDialog.event.$on('modalhide', this.hide)
    ModalDialog.event.$on('modalshow', this.show)
    ModalDialog.event.$on('modaltoggle', this.toggle)
  },
  methods: {
    hide (name) {
      if (this.name === name) this.isVisible = false
    },
    show (name) {
      if (this.name === name) this.isVisible = true
    },
    toggle (name) {
      if (this.name === name) {
        this.isVisible = !this.isVisible
      }
    }
  }
}
</script>

<style scoped>
  .modal-dialog-base {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .modal-dialog-container {
    box-sizing: border-box;
    position: fixed;
    z-index: 9999;
  }

  .modal-dialog-body {
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    height: 100%;
    margin: 1vw;
    padding: 1vw;
  }

  .modal-dialog-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 9990;
  }

  .close {
    position: absolute;
    top: 2vw;
    right: 2vw;
  }
</style>