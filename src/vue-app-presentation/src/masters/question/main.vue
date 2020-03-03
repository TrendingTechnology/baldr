<template>
  <div class="vc_question_master">
    <h1 v-if="heading" v-html="heading"/>
    <ol :class="{ numbers: showNumbers }">
      <li
        v-for="(pair, index) in questions"
        :key="pair.question"
      >
        <p class="question" v-html="pair.question"/>
        <p v-if="pair.answer">
          …
          <span
            :class="getClassHidden(index + 1)"
            class="answer"
            v-html="pair.answer"
          />
        </p>
      </li>
    </ol>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    heading: {
      type: String
    },
    questions: {
      type: Array,
      required: true
    },
    numbers: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    stepNoCurrent () {
      return this.slideCurrent.renderData.stepNoCurrent
    },
    showNumbers () {
      if (this.numbers && this.questions.length > 1) {
        return true
      }
      return false
    }
  },
  methods: {
    getClassHidden (answerNo) {
      if (this.stepNoCurrent <= answerNo) {
        return 'hidden'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
  .vc_question_master {
    font-size: 3vw;
    padding: 2vw 14vw;

    p {
      margin: 0;
    }

    li {
      margin-top: 2vw;
      margin-bottom: 2vw;
      list-style-type: none;
    }

    ol {
      padding-left: 3vw;
    }

    ol.numbers li {
      list-style-type: decimal;
    }

    .answer {
      font-style: italic;
      font-size: 0.8em
    }

    .hidden {
      visibility: hidden;
    }
  }
</style>
