import { Test } from '../classes/Test';
import { TestData } from '../interfaces/TestInterfaces';

export function renderSummaryView(container: HTMLElement, testData: TestData, test: Test) {
    const correctAnswers = test.calculateCorrectAnswers();
    const totalQuestions = testData.questions.length;
    const totalTimeSeconds = Math.floor(test.getTotalTime() / 1000);

    let questionStats = '';
    testData.questions.forEach((question) => {
        const timeSpent = test.getFinalQuestionTime(question.id);
        const timeSpentSeconds = Math.floor(timeSpent / 1000);
        const userAnswerIndex = test.getAnswers().get(question.id);
        const isCorrect = userAnswerIndex === question.correctOption;

        questionStats += `
      <div>
        <p>Pytanie: ${question.question}</p>
        <p>Twoja odpowiedź: ${userAnswerIndex !== undefined ? question.options[userAnswerIndex] : 'Brak odpowiedzi'}</p>
        <p>Poprawna odpowiedź: ${question.options[question.correctOption]}</p>
        <p>Odpowiedź ${isCorrect ? 'poprawna' : 'niepoprawna'}</p>
        <p>Czas spędzony: ${timeSpentSeconds} sekund</p>
      </div>
      <hr />
    `;
    });

    container.innerHTML = `
    <h1>Podsumowanie testu: ${testData.title}</h1>
    <p>Liczba poprawnych odpowiedzi: ${correctAnswers} z ${totalQuestions}</p>
    <p>Łączny czas: ${totalTimeSeconds} sekund</p>
    <h2>Statystyki pytań:</h2>
    ${questionStats}
    <button id="return-button">Powrót</button>
  `;

    const returnButton = container.querySelector('#return-button') as HTMLButtonElement;
    returnButton.addEventListener('click', () => {
        location.reload();
    });
}
