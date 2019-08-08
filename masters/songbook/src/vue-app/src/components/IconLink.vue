<template>
  <a
    v-if="link"
    :href="link"
  >
    <material-icon :name="icon"/>
  </a>
</template>

<script>
import { MaterialIcon } from '@bldr/vue-components'

export default {
  name: 'IconLink',
  components: {
    MaterialIcon
  },
  props: {
    link: {
      type: String
    },
    icon: {
      type: String
    }
  }
}
</script>
