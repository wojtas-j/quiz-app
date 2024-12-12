import allTestsDataJson from '../data/testQuestions.json';
import { AllTestsData } from './interfaces/TestInterfaces';
import { renderStartView } from './renderers/StartView';
import { Quiz } from './classes/Quiz';
import { renderQuestionView } from './renderers/QuestionView';

const allTestsData = allTestsDataJson as AllTestsData;

const appContainer = document.getElementById('app');

if (appContainer) {
    renderStartView(appContainer, allTestsData, startTest);
}

function startTest(testId: number) {
    const selectedTest = allTestsData.tests.find((t) => t.id === testId)!;
    const quizInstance = new Quiz(selectedTest.questions);
    quizInstance.start();

    function updateView() {
        renderQuestionView(appContainer!, selectedTest, quizInstance, updateView);
    }

    updateView();
}
