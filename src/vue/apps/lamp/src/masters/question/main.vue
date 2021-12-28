<template>
  <div class="vc_question_master main-app-padding">
    <question v-if="question" :question="question" />
    <ol v-if="subQuestions">
      <li v-for="question in subQuestions" :key="question.question">
        <question :question="question" />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Question from './Question.vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { buildQuestionStepController } from '@bldr/dom-manipulator'
import { questionMModul } from '@bldr/presentation-parser'

import MasterMainWithStepController from '../MasterMainWithStepController.vue'

@Component({
  components: {
    Question
  }
})
export default class QuestionMasterMain extends MasterMainWithStepController {
  masterName = 'question'

  @Prop({
    type: Array,
    required: true
  })
  questions: questionMModul.Question[]

  get sequence (): questionMModul.QuestionSequence {
    return this.questions[0].sequence
  }

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

  private setQuestionsByStepNo (stepNo: number): void {
    // Question without a question or answer. Only the heading. Or
    // only one question
    if (this.sequence.length <= 1) {
      return
    }

    // q1 or a1
    const curId = this.sequence[stepNo - 1]

    for (const id of this.sequence) {
      const element = this.$el.querySelector(`#${id}`)
      if (element != null) {
        element.classList.remove('active')
      }
    }

    const isAnswer = curId.match(/^a/)
    const element = this.$el.querySelector(`#${curId}`)
    if (element == null) {
      return
    }
    element.classList.add('active')
    if (isAnswer != null) {
      const answerNo = parseInt(curId.substr(1))
      this.stepController.showUpTo(answerNo + 1)
    }
    if (stepNo === 1) {
      window.scrollTo(0, 0)
    } else {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }

  afterSlideNoChange (): void {
    this.stepController = buildQuestionStepController(this.$el as HTMLElement)
    this.stepController.hideAll()
  }

  afterStepNoChange ({ newStepNo }): void {
    this.setQuestionsByStepNo(newStepNo)
  }
}
</script>

<style lang="scss">
.vc_question_master {
  p {
    margin: 0;
    padding: 0.1em 0.3em;
  }

  .level-0 ol {
    list-style-type: decimal;
  }
  .level-1 ol {
    list-style-type: lower-alpha;
  }
  .level-2 ol {
    list-style-type: lower-roman;
  }

  .answer {
    font-style: italic;
    font-size: 0.8em;
  }
}
</style>
