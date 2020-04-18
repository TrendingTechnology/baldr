<template>
  <section class="vc_presentation_title" v-if="presentation">
    <nav>
      <ul>
        <li v-for="(link, index) in curriculumLinks" :key="link.path">
          <router-link :to="`/${link.path}`" v-html="link.text"/>
          <span v-if="index < curriculumLinks.length - 1" class="separator">/</span>
        </li>
      </ul>
    </nav>

    <h1 v-html="presentation.title"/>
    <h2 v-if="presentation.subtitle" v-html="presentation.subtitle"/>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'PresentationTitle',
  computed: {
    ...mapGetters(['presentation']),
    curriculumLinks () {
      const titlesText = `${this.presentation.grade}. Jahrgangsstufe / ${this.presentation.curriculum}`
      const titles = titlesText.split(' / ')
      const ids = this.presentation.parentDir.split('/')
      const links = []
      links.push({ path: 'presentation-overview/Musik', text: 'Fach Musik' })
      for (let index = 0; index < titles.length; index++) {
        links.push({
          path: ['presentation-overview', ...ids.slice(0, index + 1)].join('/'),
          text: titles[index]
        })
      }
      return links
    }
  }
}
</script>

<style lang="scss">
  .vc_presentation_title {
    nav ul {
      li {
        display: inline;
      }

      li:before {
        content: ''
      }
    }

    .separator {
      display: inline-block;
      padding: 0 0.3em;
    }
  }
</style>
