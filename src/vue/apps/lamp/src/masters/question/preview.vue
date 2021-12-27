<template>
  <div
    class="
    vc_question_master_preview
    slide-preview-fix-typography
    slide-preview-valign-center
    slide-preview-fullscreen
  "
  >
    <question v-if="question" :question="question" no-answer />
    <ol v-if="subQuestions">
      <li v-for="question in subQuestions" :key="question.question">
        <question :question="question" no-answer />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'
import Question from './Question.vue'

@Component({
  components: {
    Question
  }
})
export default class QuestionMasterPreview extends MasterPreview {
  masterName = 'question'

  @Prop({
    type: Array,
    required: true
  })
  questions: any[]

  get subQuestions () {
    if (this.questions.length > 1) {
      return this.questions
    }
    return ''
  }

  get question () {
    if (this.questions.length === 1) {
      return this.questions[0]
    }
    return ''
  }
}
</script>

<style lang="scss">
.vc_question_master_preview {
  ol {
    padding-left: 1em;
  }
}
</style>
