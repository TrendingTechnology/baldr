<template>
  <div id="app" @drop.prevent="dropHandler" @dragover.prevent>
      <modal-dialog name="menu">
        <main-menu/>
      </modal-dialog>
    <main>
      <div id='content'>
        <router-view/>
      </div>
    </main>
    <app-info package-name="@bldr/showroom" :version="version"/>
  </div>
</template>

<script>
import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/vue-components-collection'
import MainMenu from '@/components/MainMenu'
import { mapActions } from 'vuex'
import { openFiles } from '@/content-file.js'

export default {
  name: 'app',
  components: {
    AppInfo,
    MainMenu
  },
  computed: {
    version () {
      return packageJson.version
    }
  },
  methods: {
    ...mapActions(['setSlidePrevious', 'setSlideNext', 'setStepPrevious', 'setStepNext']),
    dropHandler (event) {
      openFiles(event.dataTransfer.files)
    }
  },
  created: function () {
    this.$overflow.set(true)
    this.$resolveHttpURL('id:Haydn_Joseph')
  },
  mounted: function () {
    this.$nextTick(function () {
      this.$shortcuts.add('g m', () => { this.$router.push('/media') }, 'Go to media')
      this.$shortcuts.add('g s', () => { this.$router.push('/slides') }, 'Go to slides')
      this.$shortcuts.add('g d', () => { this.$router.push('/documentation') }, 'Go to documentation')
      this.$shortcuts.add('g r', () => { this.$router.push('/rest-api') }, 'Go to REST API overview')

      this.$shortcuts.addMultiple([
        {
          keys: 'g S',
          callback: () => { this.$router.push('/shortcuts') },
          description: 'Go to shortcuts'
        },
        {
          keys: 'left',
          callback: () => { this.setSlidePrevious() },
          description: 'Previous slide'
        },
        {
          keys: 'right',
          callback: () => { this.setSlideNext() },
          description: 'Next slide'
        },
        {
          keys: 'up',
          callback: () => { this.setStepPrevious() },
          description: 'Previous stop'
        },
        {
          keys: 'down',
          callback: () => { this.setStepNext() },
          description: 'Next step'
        }
      ])

      window.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key === 'm') {
          // Disable Mute audio
          event.preventDefault()
        } else if (event.ctrlKey && event.key === 'd') {
          // edit bookmarks
          event.preventDefault()
        }
      })

      window.addEventListener('keyup', event => {
        if (event.ctrlKey && event.key === 'm') {
          this.$modal.toggle('menu')
        } else if (event.ctrlKey && event.key === 'd') {
          this.$darkMode.toggle()
        } else if (event.ctrlKey && event.altKey && event.key === 'v') {
          this.$centerVertically.toggle()
        }
      })
    })
  }
}
</script>
<style lang="scss">
  @import '~@bldr/theme-default/styles.css';

  body {
    margin: 0;
  }

  main {
    font-size: 4vw;
    height: 100vh;
    width: 100vw;

    #content {
      padding: 2vw 8vw;
    }
  }

  [b-overflow="true"] {
    main {
      overflow: hidden;
    }
  }

  [b-center-vertically="true"] {
    main {
      display: table;
    }

    #content {
      display: table-cell;
      vertical-align: middle;
      height: 100%;
    }
  }
</style>
