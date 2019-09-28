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
  methods: {
    openExample (master) {
      this.$store.dispatch('openPresentation', master.example).then(() => {
        this.$router.push('/slides')
      })
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
  }
</style>
