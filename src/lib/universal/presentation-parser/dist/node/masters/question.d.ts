import { Master } from '../master';
/**
 * Collection all question text (without answers) to build the plain
 * text version.
 */
export declare function collectPlainText(text: string, questions: Question[]): string;
interface Counter {
    sequence: QuestionSequence;
    question: number;
    answer: number;
}
interface Spec {
    question?: string;
    answer?: string;
    heading?: string;
    subQuestions?: Spec[];
}
interface RawSpecObject extends Spec {
    q?: string;
    a?: string;
    h?: string;
    s?: RawSpecObject[];
    questions?: RawSpecObject[];
}
interface QuestionFieldData {
    questions: Question[];
}
declare type RawSpec = string | string[] | RawSpecObject | RawSpecObject[];
/**
 * `q` stands for question. `a` stands for answer.
 *
 * `['q1', 'a1', 'q2', 'q3']`
 */
export declare type QuestionSequence = string[];
/**
 * A question with sub questions.
 */
export declare class Question {
    level: number;
    heading?: string;
    question?: string;
    questionNo?: number;
    answer?: string;
    answerNo?: number;
    subQuestions?: Question[];
    private readonly counter;
    constructor(spec: Spec, counter: Counter, level: number);
    get sequence(): QuestionSequence;
    get stepCount(): number;
    /**
     * heading + question without answer.
     */
    get questionText(): string;
    private static parseRecursively;
    private static initCounter;
    static parse(rawSpec: RawSpec): Question[];
}
export declare function generateTexMarkup(fields: QuestionFieldData): string;
export declare class QuestionMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        size: "large";
        /**
         * U+2754
         *
         * @see https://emojipedia.org/white-question-mark/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        questions: {
            description: string;
            required: boolean;
            markup: boolean;
        };
    };
    normalizeFieldsInput(fields: RawSpec): QuestionFieldData;
    generateTexMarkup(fields: QuestionFieldData): string;
}
export {};
