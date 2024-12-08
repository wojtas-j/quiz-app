import { Question } from '../interfaces/TestInterfaces';

export class Test {
    questions: Question[];
    currentQuestionIndex: number = 0;
    startTime: number = 0;
    questionStartTime: number = 0;
    totalTime: number = 0;
    questionTimes: Map<number, number> = new Map();
    answers: Map<number, number> = new Map();

    constructor(questions: Question[]) {
        this.questions = this.shuffleArray(questions);
    }

    start() {
        this.startTime = Date.now();
        this.startQuestionTimer();
    }

    startQuestionTimer() {
        this.questionStartTime = Date.now();
    }

    stopQuestionTimer() {
        const timeSpent = Date.now() - this.questionStartTime;
        const questionId = this.getCurrentQuestion().id;
        this.questionTimes.set(questionId, timeSpent);
    }

    getCurrentQuestion(): Question {
        return this.questions[this.currentQuestionIndex];
    }

    answerCurrentQuestion(selectedOptionIndex: number) {
        const questionId = this.getCurrentQuestion().id;
        this.answers.set(questionId, selectedOptionIndex);
    }

    nextQuestion() {
        this.stopQuestionTimer();
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.startQuestionTimer();
        }
    }

    previousQuestion() {
        this.stopQuestionTimer();
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.startQuestionTimer();
        }
    }

    isTestComplete(): boolean {
        return this.answers.size === this.questions.length;
    }

    finishTest() {
        this.totalTime = Date.now() - this.startTime;
    }

    private shuffleArray<T>(array: T[]): T[] {
        return array.sort(() => Math.random() - 0.5);
    }
}
