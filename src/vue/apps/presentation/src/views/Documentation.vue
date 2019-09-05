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
          @click.native="openExample(master)"
        />
      </li>
    </ul>
  </section>

</div>
</template>

<script>
export default {
  name: 'Documentation',
  created: function () {
    this.$centerVertically.set(false)
    this.$darkMode.set(false)
  },
  methods: {
    openExample (master) {
      this.$store.dispatch('openPresentation', master.example)
      this.$router.push('/slides')
    }
  }
}
</script>

<style lang="scss" scoped>
  .documentation {
    font-size: 1.4vw;
  }
</style>
