import { AllTestsData } from '../interfaces/TestInterfaces';

export function renderStartView(
    container: HTMLElement,
    allTestsData: AllTestsData,
    onStart: (testId: number) => void
) {
    container.innerHTML = `
    <h1>Wybierz test</h1>
    <ul>
      ${allTestsData.tests
        .map(
            (test) => `
        <li>
          <button class="test-select-button" data-test-id="${test.id}">${test.title}</button>
        </li>
      `
        )
        .join('')}
    </ul>
  `;

    const buttons = container.querySelectorAll('.test-select-button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const testId = parseInt((button as HTMLElement).getAttribute('data-test-id')!);
            renderTestIntroduction(container, testId, allTestsData, onStart);
        });
    });
}

function renderTestIntroduction(
    container: HTMLElement,
    testId: number,
    allTestsData: AllTestsData,
    onStart: (testId: number) => void
) {
    const selectedTest = allTestsData.tests.find((test) => test.id === testId)!;

    container.innerHTML = `
    <h1>${selectedTest.title}</h1>
    <p>${selectedTest.introduction}</p>
    <button id="start-test-button">Start</button>
  `;

    const startButton = container.querySelector('#start-test-button') as HTMLButtonElement;
    startButton.addEventListener('click', () => {
        onStart(testId);
    });
}
