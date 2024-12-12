import { Quiz } from '../classes/Quiz';
import { TestData } from '../interfaces/TestInterfaces';
import { renderSummaryView } from './SummaryView';

let lastRenderedQuestionIndex: number | null = null;
let questionTimerInterval: number | null = null;

export function renderQuestionView(
    container: HTMLElement,
    testData: TestData,
    quiz: Quiz,
    onUpdate: () => void
) {
    stopTimers();

    const question = quiz.getCurrentQuestion();
    const totalQuestions = quiz.getQuestionsCount();
    const currentQuestionNumber = quiz.getCurrentQuestionIndex() + 1;
    const qId = question.id;
    const isLocked = quiz.isQuestionLocked(qId);

    const currentIndex = quiz.getCurrentQuestionIndex();
    const questionChanged = (lastRenderedQuestionIndex !== currentIndex);
    lastRenderedQuestionIndex = currentIndex;

    container.innerHTML = `
    <h1>${testData.title}</h1>
    <p>${testData.introduction}</p>
    <p>Pytanie ${currentQuestionNumber} z ${totalQuestions}</p>
    <p>${question.question}</p>
    <ul>
      ${question.options.map((option, index) => {
        const userAnswer = quiz.getAnswers().get(qId);
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
      <button id="finish-button" ${quiz.isTestComplete() ? '' : 'disabled'}>Zakończ</button>
      <button id="cancel-button">Anuluj</button>
    </div>
    <p id="question-time">Czas nad pytaniem: 0 s</p>
    <p id="total-time">Łączny czas: 0 s</p>
  `;

    if (!isLocked && questionChanged) {
        quiz.startQuestionTimer();
    }

    startTimers();

    const optionInputs = container.querySelectorAll('input[name="option"]');
    optionInputs.forEach((input) => {
        input.addEventListener('change', () => {
            if (!isLocked) {
                const selectedOptionIndex = parseInt((input as HTMLInputElement).value);
                quiz.answerCurrentQuestion(selectedOptionIndex);
                onUpdate();
            }
        });
    });

    const prevButton = container.querySelector('#prev-button') as HTMLButtonElement;
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            stopTimers();
            quiz.stopQuestionTimerAndLockIfAnswered();
            quiz.previousQuestion();
            onUpdate();
        });
    }

    const nextButton = container.querySelector('#next-button') as HTMLButtonElement;
    nextButton.addEventListener('click', () => {
        stopTimers();
        quiz.stopQuestionTimerAndLockIfAnswered();
        quiz.nextQuestion();
        onUpdate();
    });

    const finishButton = container.querySelector('#finish-button') as HTMLButtonElement;
    finishButton.addEventListener('click', () => {
        stopTimers();
        quiz.stopQuestionTimerAndLockIfAnswered();
        quiz.finishTest();
        renderSummaryView(container, testData, quiz);
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

        const q = quiz.getCurrentQuestion();
        const qId = q.id;
        const isLocked = quiz.isQuestionLocked(qId);

        const totalTestTime = Date.now() - quiz.getStartTime();
        totalTimeElement.textContent = `Łączny czas: ${Math.floor(totalTestTime / 1000)} s`;

        if (isLocked) {
            const finalTime = quiz.getFinalQuestionTime(qId);
            questionTimeElement.textContent = `Czas nad pytaniem: ${Math.floor(finalTime / 1000)} s`;
        } else {
            const accumulated = quiz.getAccumulatedTimeForQuestion(qId);
            const currentElapsed = Date.now() - quiz.getQuestionStartTime();
            const displayTime = accumulated + currentElapsed;
            questionTimeElement.textContent = `Czas nad pytaniem: ${Math.floor(displayTime / 1000)} s`;
        }
    }
}
