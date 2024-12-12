import { Quiz } from '../classes/Quiz';
import { TestData } from '../interfaces/TestInterfaces';

export function renderSummaryView(container: HTMLElement, testData: TestData, quiz: Quiz) {
    const correctAnswers = quiz.calculateCorrectAnswers();
    const totalQuestions = testData.questions.length;
    const totalTimeSeconds = Math.floor(quiz.getTotalTime() / 1000);

    let questionStats = '';
    testData.questions.forEach((question) => {
        const timeSpent = quiz.getFinalQuestionTime(question.id);
        const timeSpentSeconds = Math.floor(timeSpent / 1000);
        const userAnswerIndex = quiz.getAnswers().get(question.id);
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

    container.classList.add('summary-view');

    const returnButton = container.querySelector('#return-button') as HTMLButtonElement;
    returnButton.addEventListener('click', () => {
        location.reload();
    });
}
