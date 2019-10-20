<template>
<div class="vc_documentation_overview" b-ui-theme="default">
  <h1>Documentation</h1>

  <section>
    <h2>Master slides</h2>

    <table>
      <thead>
        <tr>
          <td></td>
          <td>ID</td>
          <td>Title</td>
          <td>Example</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(master, masterName) in $masters"
          :key="masterName"
        >
          <td><material-icon :name="master.icon" :color="master.color"/></td>
          <td>
            <router-link :to="{ name: 'documentation-master', params: { master: masterName } }">
              {{ masterName }}
            </router-link>
          </td>
          <td>{{ master.title }}</td>
          <td>
            <material-icon
              v-if="master.example"
              name="presentation"
              @click.native="openExample(master.example)"
            />
          </td>
        </tr>
      </tbody>
    </table>

  </section>

</div>
</template>

<script>
export default {
  name: 'DocumentationOverview',
  methods: {
    openExample (yamlString) {
      this.$store.dispatch('openPresentation', yamlString).then(() => {
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
  .vc_documentation_overview {
    font-size: 2vw;

    a {
      cursor: pointer;
    }

    table {
      width: 100%;
    }
  }
</style>
