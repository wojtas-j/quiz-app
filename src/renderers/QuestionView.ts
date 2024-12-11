import { Test } from '../classes/Test';
import { TestData } from '../interfaces/TestInterfaces';
import { renderSummaryView } from './SummaryView';

let lastRenderedQuestionIndex: number | null = null;
let questionTimerInterval: number | null = null;

export function renderQuestionView(
    container: HTMLElement,
    testData: TestData,
    test: Test,
    onUpdate: () => void
) {
    stopTimers();

    const question = test.getCurrentQuestion();
    const totalQuestions = test.getQuestionsCount();
    const currentQuestionNumber = test.getCurrentQuestionIndex() + 1;
    const qId = question.id;
    const isLocked = test.isQuestionLocked(qId);

    const currentIndex = test.getCurrentQuestionIndex();
    const questionChanged = (lastRenderedQuestionIndex !== currentIndex);
    lastRenderedQuestionIndex = currentIndex;

    container.innerHTML = `
    <h1>${testData.title}</h1>
    <p>${testData.introduction}</p>
    <p>Pytanie ${currentQuestionNumber} z ${totalQuestions}</p>
    <p>${question.question}</p>
    <ul>
      ${question.options.map((option, index) => {
        const userAnswer = test.getAnswers().get(qId);
        return `
        <li>
          <label>
            <input type="radio" name="option" value="${index}"
              ${userAnswer === index ? 'checked' : ''}
              ${isLocked ? 'disabled' : ''} />
            ${option}
          </label>
        </li>
      `;
    }).join('')}
    </ul>
    <div>
      ${currentIndex > 0 ? '<button id="prev-button">Poprzedni</button>' : ''}
      <button id="next-button">Następny</button>
      <button id="finish-button" ${test.isTestComplete() ? '' : 'disabled'}>Zakończ</button>
      <button id="cancel-button">Anuluj</button>
    </div>
    <p id="question-time">Czas nad pytaniem: 0 s</p>
    <p id="total-time">Łączny czas: 0 s</p>
  `;

    // Jeśli pytanie nie jest zablokowane i faktycznie zmieniliśmy pytanie, startujemy licznik od zera
    if (!isLocked && questionChanged) {
        test.startQuestionTimer();
    }

    startTimers();

    const optionInputs = container.querySelectorAll('input[name="option"]');
    optionInputs.forEach((input) => {
        input.addEventListener('change', () => {
            if (!isLocked) {
                const selectedOptionIndex = parseInt((input as HTMLInputElement).value);
                test.answerCurrentQuestion(selectedOptionIndex);
                onUpdate();
            }
        });
    });

    const prevButton = container.querySelector('#prev-button') as HTMLButtonElement;
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            stopTimers();
            test.stopQuestionTimerAndLockIfAnswered();
            test.previousQuestion();
            onUpdate();
        });
    }

    const nextButton = container.querySelector('#next-button') as HTMLButtonElement;
    nextButton.addEventListener('click', () => {
        stopTimers();
        test.stopQuestionTimerAndLockIfAnswered();
        test.nextQuestion();
        onUpdate();
    });

    const finishButton = container.querySelector('#finish-button') as HTMLButtonElement;
    finishButton.addEventListener('click', () => {
        stopTimers();
        test.stopQuestionTimerAndLockIfAnswered();
        test.finishTest();
        renderSummaryView(container, testData, test);
    });

    const cancelButton = container.querySelector('#cancel-button') as HTMLButtonElement;
    cancelButton.addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz anulować test?')) {
            location.reload();
        }
    });

    function stopTimers() {
        if (questionTimerInterval !== null) {
            clearInterval(questionTimerInterval);
            questionTimerInterval = null;
        }
    }

    function startTimers() {
        updateTimers();
        questionTimerInterval = window.setInterval(updateTimers, 1000);
    }

    function updateTimers() {
        const questionTimeElement = document.getElementById('question-time')!;
        const totalTimeElement = document.getElementById('total-time')!;

        const q = test.getCurrentQuestion();
        const qId = q.id;
        const isLocked = test.isQuestionLocked(qId);

        const totalTestTime = Date.now() - test.getStartTime();
        totalTimeElement.textContent = `Łączny czas: ${Math.floor(totalTestTime / 1000)} s`;

        if (isLocked) {
            // Pytanie zablokowane: wyświetlamy finalny czas
            const finalTime = test.getFinalQuestionTime(qId);
            questionTimeElement.textContent = `Czas nad pytaniem: ${Math.floor(finalTime / 1000)} s`;
        } else {
            // Pytanie niezablokowane: czas to accumulated + (aktualny przebieg od questionStartTime)
            const accumulated = test.getAccumulatedTimeForQuestion(qId);
            const currentElapsed = Date.now() - test.getQuestionStartTime();
            const displayTime = accumulated + currentElapsed;
            questionTimeElement.textContent = `Czas nad pytaniem: ${Math.floor(displayTime / 1000)} s`;
        }
    }
}
