import allTestsDataJson from '../data/testQuestions.json';
import { AllTestsData } from './interfaces/TestInterfaces';
import { renderStartView } from './renderers/StartView';
import { Test } from './classes/Test';
import { renderQuestionView } from './renderers/QuestionView';

const allTestsData = allTestsDataJson as AllTestsData;

const appContainer = document.getElementById('app');

if (appContainer) {
    renderStartView(appContainer, allTestsData, startTest);
}

function startTest(testId: number) {
    const selectedTest = allTestsData.tests.find((test) => test.id === testId)!;
    const test = new Test(selectedTest.questions);
    test.start();

    function updateView() {
        renderQuestionView(appContainer!, selectedTest, test, updateView);
    }

    updateView();
}
