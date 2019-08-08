<script>
import ModalDialog from './index'

export default {
  name: 'ModalDialog',
  props: {
    bodyClass: {
      type: String
    },
    containerClass: {
      type: String
    },
    footerClass: {
      type: String
    },
    headerClass: {
      type: String
    },
    height: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    overlayClass: {
      type: String
    },
    transition: {
      type: String
    },
    width: {
      type: String
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
      this.$emit('cute:hide')
      this.isOpen = false
      this.triggerEvents()
    },
    toggle (name) {
      if (this.name === name) {
        this.$emit('cute:toggle')
        this.isOpen = !this.isOpen
        this.triggerEvents()
      }
    },
    triggerEvents () {
      const { onClose, onOpen } = this.$modal.options()

      if (this.isOpen && onOpen) {
        onOpen()
      }

      if (!this.isOpen && onClose) {
        onClose()
      }
    }
  },
  render (h) {
    const {
      body,
      container,
      footer,
      header,
      height,
      overlay,
      width
    } = this.$modal.options()

    return (
      <div>
        {this.isOpen ? (
          <div class="modal-base">
            <div class="cute-modal__overlay" on-click={this.hide} />
            <div class='cute-modal' role='dialog'>
              <div class="cute-modal__container">
                <div class="cute-modal__body">
                  {this.$slots.default}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
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
  .cute-modal {
    position: fixed;
    z-index: 9999;
    box-sizing: border-box;
  }
  .cute-modal__body {
    height: 100%;
    padding: 0.75rem 1rem;
    background-color: #f1f5f8;
  }
  .cute-modal__container {
    margin: 0 auto;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 10px 40px 0 rgba(62,57,107,0.07), 0 2px 9px 0 rgba(62,57,107,0.06);
    transition: all 0.3s ease;
  }
  .cute-modal__overlay {
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