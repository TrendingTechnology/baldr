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

<script lang="ts">
import Plugin, { dialogsWatcher } from './main.js'
import { Vue, Component, Prop } from '@bldr/vue-packages-bundler'

// Components
import { MaterialIcon } from '@bldr/icons'

@Component({
  components: {
    MaterialIcon
  }
})
export default class ModalDialog extends Vue {
  data () {
    return {
      isVisible: false
    }
  }
  isVisible: boolean

  @Prop({
    type: String,
    required: true
  })
  name!: string

  mounted () {
    Plugin.event.$on('modalhide', this.hide)
    Plugin.event.$on('modalshow', this.show)
    Plugin.event.$on('modaltoggle', this.toggle)
  }

  hide (name: string) {
    if (this.name === name) {
      this.isVisible = false
      dialogsWatcher.setVisiblity(name, this.isVisible)
    }
  }

  show (name: string) {
    if (this.name === name) {
      this.isVisible = true
      dialogsWatcher.setVisiblity(name, this.isVisible)
    }
  }

  toggle (name: string) {
    if (this.name === name) {
      this.isVisible = !this.isVisible
      dialogsWatcher.setVisiblity(name, this.isVisible)
    }
  }

  created () {
    dialogsWatcher.createDialog(this.name)
  }

  beforeUpdate () {
    dialogsWatcher.destroyDialog(this.name)
  }

  destroyed () {
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
