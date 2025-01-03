import { Question } from '../interfaces/TestInterfaces';

export class Quiz {
    private questions: Question[];
    private currentQuestionIndex: number = 0;
    private startTime: number = 0;
    private questionStartTime: number = 0;
    private totalTime: number = 0;
    private finalQuestionTimes: Map<number, number> = new Map();
    private accumulatedTimes: Map<number, number> = new Map();
    private answers: Map<number, number> = new Map();
    private lockedQuestions: Set<number> = new Set();

    constructor(questions: Question[]) {
        this.questions = this.shuffleArray(questions);
    }

    start() {
        this.startTime = Date.now();
        this.startQuestionTimer();
    }

    startQuestionTimer() {
        this.questionStartTime = Date.now();
        const qId = this.getCurrentQuestion().id;
        if (!this.accumulatedTimes.has(qId)) {
            this.accumulatedTimes.set(qId, 0);
        }
    }

    private pauseQuestionTimer() {
        const qId = this.getCurrentQuestion().id;
        const elapsed = Date.now() - this.questionStartTime;
        const accumulated = this.accumulatedTimes.get(qId) || 0;
        this.accumulatedTimes.set(qId, accumulated + elapsed);
    }

    stopQuestionTimerAndLockIfAnswered() {
        const qId = this.getCurrentQuestion().id;
        this.pauseQuestionTimer();

        if (this.answers.has(qId) && !this.isQuestionLocked(qId)) {
            this.lockedQuestions.add(qId);
            const finalTime = this.accumulatedTimes.get(qId) || 0;
            this.finalQuestionTimes.set(qId, finalTime);
        }
    }

    getCurrentQuestion(): Question {
        return this.questions[this.currentQuestionIndex];
    }

    answerCurrentQuestion(selectedOptionIndex: number) {
        const qId = this.getCurrentQuestion().id;
        this.answers.set(qId, selectedOptionIndex);
    }

    isQuestionLocked(questionId: number): boolean {
        return this.lockedQuestions.has(questionId);
    }

    nextQuestion() {
        this.stopQuestionTimerAndLockIfAnswered();
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.startQuestionTimer();
        }
    }

    previousQuestion() {
        this.stopQuestionTimerAndLockIfAnswered();
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
        this.saveResults();
    }

    getFinalQuestionTime(questionId: number): number {
        return this.finalQuestionTimes.get(questionId) || 0;
    }

    getCurrentQuestionIndex(): number {
        return this.currentQuestionIndex;
    }

    getQuestionsCount(): number {
        return this.questions.length;
    }

    getAnswers(): Map<number, number> {
        return this.answers;
    }

    getStartTime(): number {
        return this.startTime;
    }

    getQuestionStartTime(): number {
        return this.questionStartTime;
    }

    getTotalTime(): number {
        return this.totalTime;
    }

    getAccumulatedTimeForQuestion(questionId: number): number {
        return this.accumulatedTimes.get(questionId) || 0;
    }

    saveResults() {
        const results = {
            answers: Array.from(this.answers.entries()),
            finalQuestionTimes: Array.from(this.finalQuestionTimes.entries()),
            totalTime: this.totalTime,
            correctAnswers: this.calculateCorrectAnswers(),
        };
        localStorage.setItem('testResults', JSON.stringify(results));
    }

    calculateCorrectAnswers(): number {
        let correctCount = 0;
        for (const question of this.questions) {
            const userAnswer = this.answers.get(question.id);
            if (userAnswer === question.correctOption) {
                correctCount++;
            }
        }
        return correctCount;
    }

    private shuffleArray<T>(array: T[]): T[] {
        return array.sort(() => Math.random() - 0.5);
    }
}
