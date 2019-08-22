<template>
  <div class="modal-dialog" v-show="isVisible">
    <div class="overlay" @click="hide(name)"/>
    <div class="container" role="dialog">
      <material-icon class="close" name="close" @click.native="hide(name)"/>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import ModalDialog from './index'
import { dialogsWatcher } from './index'

// Components
import { MaterialIcon } from '@bldr/vue-component-material-icon'

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
      if (this.name === name) {
        this.isVisible = false
        dialogsWatcher.setVisiblity(name, this.isVisible)
      }
    },
    show (name) {
      if (this.name === name) {
        this.isVisible = true
        dialogsWatcher.setVisiblity(name, this.isVisible)
      }
    },
    toggle (name) {
      if (this.name === name) {
        this.isVisible = !this.isVisible
        dialogsWatcher.setVisiblity(name, this.isVisible)
      }
    }
  },
  created: function () {
    dialogsWatcher.createDialog(this.name)
  },
  beforeUpdate: function () {
    dialogsWatcher.destroyDialog(this.name)
  },
  destroyed: function () {
    dialogsWatcher.destroyDialog(this.name)
  }
}
</script>

<style lang="scss" scoped>
  .modal-dialog {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    .container {
      box-sizing: border-box;
      height: 85%;
      position: fixed;
      width: 90%;
      z-index: 9999;
    }

    .body {
      background-color: scale-color($white, $lightness: 30%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      height: 95%;
      margin: 1vw;
      padding: 1vw;
      padding-top: 3vw;
      overflow-y: auto;
    }

    .overlay {
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
  }

</style>