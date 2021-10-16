<template>
  <div b-ui-theme="default" class="vc_modal_dialog" v-show="isVisible">
    <div class="dialog-overlay" @click="hide(name)" />
    <div class="dialog-container" role="dialog">
      <material-icon
        class="dialog-close"
        name="close"
        @click.native="hide(name)"
      />
      <div class="dialog-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import ModalDialog from './main.js'
import { dialogsWatcher } from './main.js'

// Components
import { MaterialIcon } from '@bldr/icons'

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

<style lang="scss">
[b-dark-mode='true'] .vc_modal_dialog {
  a,
  a:link,
  a:visited {
    color: $gray !important;
  }
}

.vc_modal_dialog {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  color: $black !important;

  .dialog-container {
    box-sizing: border-box;
    height: 85%;
    position: fixed;
    width: 90%;
    z-index: 9999;
  }

  .dialog-body {
    background-color: scale-color($white, $lightness: 30%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    height: 95%;
    margin: 1vw;
    padding: 1vw;
    padding-top: 3vw;
    overflow-y: auto;
  }

  .dialog-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 9990;
  }

  .dialog-close {
    position: absolute;
    top: 2vw;
    right: 2vw;
  }
}
</style>
