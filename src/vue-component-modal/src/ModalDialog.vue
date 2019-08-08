<template>
  <div v-show="isOpen">
    <div class="modal-base">
      <div class="modal-dialog__overlay" @click="hide"/>
      <div class="modal-dialog" role="dialog">
        <div class="modal-dialog__container">
          <div class="modal-dialog__body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalDialog from './index'

export default {
  name: 'ModalDialog',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  mounted () {
    ModalDialog.event.$on('toggle', this.toggle)
  },
  methods: {
    hide () {
      this.isOpen = false
    },
    toggle (name) {
      if (this.name === name) {
        this.isOpen = !this.isOpen
      }
    }
  }
}
</script>

<style scoped>
  .modal-base {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .modal-dialog {
    position: fixed;
    z-index: 9999;
    box-sizing: border-box;
  }
  .modal-dialog__body {
    height: 100%;
    padding: 0.75rem 1rem;
    background-color: #f1f5f8;
  }
  .modal-dialog__container {
    margin: 0 auto;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 10px 40px 0 rgba(62,57,107,0.07), 0 2px 9px 0 rgba(62,57,107,0.06);
    transition: all 0.3s ease;
  }
  .modal-dialog__overlay {
    position: absolute;
    z-index: 9990;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }
</style>