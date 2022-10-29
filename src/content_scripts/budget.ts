import { isNumber } from '../functional/is_number';
import { NumberInputForm } from './ui/number_input_form';

const Budget = () => {
  const createTextElement = (str: string) => {
    const span = document.createElement('span');
    span.textContent = str;
    return span;
  };

  const container = document.createElement('div');
  container.className = 'budget-container';

  const labelElement = document.createElement('label');
  labelElement.className = 'budget-label';

  labelElement.appendChild(NumberInputForm('budget-input'));
  labelElement.prepend(createTextElement('予算'));
  labelElement.appendChild(createTextElement('円'));

  container.appendChild(labelElement);
  return container;
};

console.log('budget');

document.querySelector('.BidModal__inputArea')?.prepend(Budget());

document
  .querySelector('.budget-input')
  ?.addEventListener('keydown', (event) => {
    const keyEvent = event as KeyboardEvent;
    if (!isNumber(keyEvent.key)) event.preventDefault();
  });

export {};
