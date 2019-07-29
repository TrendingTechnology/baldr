<template>
  <ul :class="{ inline: inline }" >
    <li v-for="gradeName in gradeNames" :key="gradeName">

      <span v-if="linkAsIcon">
        <span
          contenteditable
          @blur="rename(gradeName, $event)"
        >{{ gradeName }}</span>
        <router-link :to="'/grade/' + gradeName">
          <material-icon name="open-in-new"/>
        </router-link>
      </span>

      <router-link
        v-else
        :class="{placed: isGradePlaced(gradeName)}"
        :to="'/grade/' + gradeName"
      >
        {{ gradeName }}
      </router-link>

      <material-icon
        v-if="deleteIcons"
        name="delete"
        @click.native="deleteGrade(gradeName)"
      />
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from '@/components/MaterialIcon'

export default {
  name: 'GradesItems',
  props: {
    deleteIcons: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    linkAsIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: mapGetters(['gradeNames', 'isGradePlaced']),
  components: {
    MaterialIcon
  },
  data: function () {
    return {
      gradeName: ''
    }
  },
  methods: {
    ...mapActions(['deleteGrade']),
    createGrade () {
      if (this.gradeName) {
        this.$store.dispatch('createGrade', this.gradeName)
        this.gradeName = ''
      }
    },
    rename (oldGradeName, event) {
      const newGradeName = event.target.innerText
      this.$store.commit('renameGrade', {
        oldGradeName: oldGradeName,
        newGradeName: newGradeName
      })
    }
  }
}
</script>

<style scoped>
  .placed {
    text-decoration: line-through;
    color: grey;
  }
  ul.inline {
    list-style-type: none;
    margin: 0;
    padding-left: 0;
    overflow: hidden;
  }
  ul.inline li {
    float: left;
    padding: 0 0.3em;
  }
</style>
