export interface Question {
    id: number;
    question: string;
    options: string[];
    correctOption: number;
}

export interface TestData {
    id: number;
    title: string;
    introduction: string;
    questions: Question[];
}

export interface AllTestsData {
    tests: TestData[];
}
