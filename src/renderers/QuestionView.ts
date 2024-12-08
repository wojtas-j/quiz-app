import { Test } from '../classes/Test';
import { TestData } from '../interfaces/TestInterfaces';

export function renderQuestionView(container: HTMLElement, testData: TestData, test: Test, onUpdate: () => void) {
    const question = test.getCurrentQuestion();
    const totalQuestions = test.questions.length;
    const currentQuestionNumber = test.currentQuestionIndex + 1;
    const questionId = question.id;
    const isAnswered = test.answers.has(questionId);
    const canModifyAnswer = !isAnswered;

    container.innerHTML = `
    <h1>${testData.title}</h1>
    <p>${testData.introduction}</p>
    <p>Pytanie ${currentQuestionNumber} z ${totalQuestions}</p>
    <p>${question.question}</p>
    <ul>
      ${question.options.map((option, index) => `
        <li>
          <label>
            <input type="radio" name="option" value="${index}" ${test.answers.get(questionId) === index ? 'checked' : ''} ${!canModifyAnswer ? 'disabled' : ''} />
            ${option}
          </label>
        </li>
      `).join('')}
    </ul>
    <button id="prev-button">Poprzedni</button>
    <button id="next-button">Następny</button>
    <button id="finish-button" ${test.isTestComplete() ? '' : 'disabled'}>Zakończ</button>
  `;

    const optionInputs = container.querySelectorAll('input[name="option"]');
    optionInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (canModifyAnswer) {
                const selectedOptionIndex = parseInt((input as HTMLInputElement).value);
                test.answerCurrentQuestion(selectedOptionIndex);
                //TODO Po zaznaczeniu odpowiedzi i przejściu dalej, odpowiedź nie może być zmieniona
            }
        });
    });

    const prevButton = container.querySelector('#prev-button') as HTMLButtonElement;
    prevButton.addEventListener('click', () => {
        test.previousQuestion();
        onUpdate();
    });

    const nextButton = container.querySelector('#next-button') as HTMLButtonElement;
    nextButton.addEventListener('click', () => {
        test.nextQuestion();
        onUpdate();
    });

    const finishButton = container.querySelector('#finish-button') as HTMLButtonElement;
    finishButton.addEventListener('click', () => {
        test.finishTest();
        //TODO Podsumowanie
    });
}
