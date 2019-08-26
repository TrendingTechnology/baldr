<template>
<div class="documentation">
  Documentation

  <h1>Master slides</h1>

  <ul v-for="(master, masterName) in $masters" :key="masterName">
    <li>
      <router-link :to="{ name: 'documentation-master', params: { master: masterName } }">
        {{ masterName }}
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Documentation',
  created: function () {
    this.$centerVertically.set(false)
    this.$darkMode.set(false)
  }
}
</script>

<style lang="scss" scoped>
  .documentation {
    font-size: 1.4vw;
  }
</style>
