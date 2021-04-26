"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const markdown_to_html_1 = require("@bldr/markdown-to-html");
/**
 * We want no lists `<ol>` etc in the HTML output for the question and the
 * heading. `1. act` is convert by `marked` into those lists. This is a
 * quick and dirty hack. Disable some renderer
 * https://marked.js.org/#/USING_PRO.md may be better.
 */
function convertMarkdownToHtmlNoLists(text) {
    text = markdown_to_html_1.convertMarkdownStringToHtml(text);
    // <ol start="2">
    text = text.replace(/<\/?(ul|ol|li)[^>]*?>/g, '');
    return text.trim();
}
function normalizeSpec(spec) {
    const output = {};
    if (typeof spec === 'string') {
        output.question = spec;
        return output;
    }
    if (typeof spec === 'object') {
        if (spec.q != null)
            output.question = spec.q;
        if (spec.question != null)
            output.question = spec.question;
        if (spec.a != null)
            output.answer = spec.a;
        if (spec.answer != null)
            output.answer = spec.answer;
        if (spec.h != null)
            output.heading = spec.h;
        if (spec.heading != null)
            output.heading = spec.heading;
        if (spec.s != null)
            output.subQuestions = normalizeMultipleSpecs(spec.s);
        if (spec.subQuestions != null)
            output.subQuestions = normalizeMultipleSpecs(spec.subQuestions);
        if (spec.questions != null)
            output.subQuestions = normalizeMultipleSpecs(spec.questions);
    }
    return output;
}
function normalizeMultipleSpecs(specs) {
    if (Array.isArray(specs)) {
        const output = [];
        for (const spec of specs) {
            output.push(normalizeSpec(spec));
        }
        return output;
    }
    return [
        normalizeSpec(specs)
    ];
}
/**
 * A questions with sub questions.
 */
class Question {
    constructor(spec, counter, level) {
        this.counter = counter;
        if (spec.heading != null) {
            this.heading = convertMarkdownToHtmlNoLists(spec.heading);
        }
        if (spec.question != null) {
            this.question = convertMarkdownToHtmlNoLists(spec.question);
            counter.question++;
            counter.sequence.push(`q${counter.question}`);
            this.questionNo = counter.question;
        }
        if (spec.answer != null) {
            this.answer = markdown_to_html_1.convertMarkdownStringToHtml(spec.answer);
            counter.answer++;
            counter.sequence.push(`a${counter.answer}`);
            this.answerNo = counter.answer;
        }
        if (this.question != null) {
            this.level = level + 1;
        }
        else {
            // Question object without a question. Only a heading
            this.level = level;
        }
        if (spec.subQuestions != null) {
            this.subQuestions = [];
            Question.parseRecursively(spec.subQuestions, this.subQuestions, counter, this.level);
        }
    }
    get sequence() {
        return this.counter.sequence;
    }
    get stepCount() {
        return this.sequence.length;
    }
    /**
     * heading + question without answer.
     */
    get questionText() {
        let output = '';
        if (this.heading != null)
            output = output + this.heading;
        if (this.question != null)
            output = output + this.question;
        return output;
    }
    static parseRecursively(rawSpecs, processed, counter, level) {
        const specs = normalizeMultipleSpecs(rawSpecs);
        if (Array.isArray(specs)) {
            for (const spec of specs) {
                processed.push(new Question(spec, counter, level));
            }
            return processed;
        }
        processed.push(new Question(specs, counter, level));
        return processed;
    }
    static initCounter() {
        return {
            sequence: [],
            question: 0,
            answer: 0
        };
    }
    static parse(rawSpecs) {
        const counter = Question.initCounter();
        return Question.parseRecursively(rawSpecs, [], counter, 0);
    }
}
exports.Question = Question;
