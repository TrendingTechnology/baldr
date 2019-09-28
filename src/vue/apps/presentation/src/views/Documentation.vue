<template>
<div class="documentation">
  <h1>Documentation</h1>

  <section>
    <h2>Master slides</h2>

    <ul>
      <li
        v-for="(master, masterName) in $masters"
        :key="masterName"
      >
        <router-link :to="{ name: 'documentation-master', params: { master: masterName } }">
          {{ masterName }}
        </router-link>

        <material-icon
          v-if="master.example"
          name="presentation"
          @click.native="openExample(master.example)"
        />
      </li>
    </ul>
  </section>

  <section>
    <h2>Examples</h2>

    <ul>
      <li
        v-for="(yamlContent, exampleName) in examples"
        :key="exampleName"
      >
        <a @click="openExample(yamlContent)">
          {{ exampleName }}
          <material-icon name="presentation"/>
        </a>
      </li>
    </ul>

  </section>

</div>
</template>

<script>
import examples from '@/examples.js'

export default {
  name: 'Documentation',
  methods: {
    openExample (yamlString) {
      this.$store.dispatch('openPresentation', yamlString).then(() => {
        this.$router.push('/slides')
      })
    }
  },
  data () {
    return {
      examples
    }
  },
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false
    })
  }
}
</script>

<style lang="scss" scoped>
  .documentation {
    font-size: 1.4vw;

    a {
      cursor: pointer;
    }
  }
</style>
