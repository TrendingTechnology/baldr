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

import { questionMModul } from '@bldr/presentation-parser'

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
    required: true
  })
  questions!: questionMModul.Question[]

  get subQuestions (): questionMModul.Question[] | undefined {
    if (this.questions.length > 1) {
      return this.questions
    }
  }

  get question (): questionMModul.Question | undefined {
    if (this.questions.length === 1) {
      return this.questions[0]
    }
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
