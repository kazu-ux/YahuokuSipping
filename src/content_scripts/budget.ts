import { getAuctionId } from '../functional/get_auction_id';
import { isNumber } from '../functional/is_number';
import { CookieManager } from './cookie/CookieManager';
import { NumberInputForm } from './ui/number_input_form';

const cookieManager = CookieManager(getAuctionId());
const shipping = (await cookieManager.getCookie())?.value;

const getCurrentPrice = () => {
  const targetElement = document.querySelector('.Price__value');
  if (!targetElement) return;
  return Number(
    targetElement.childNodes[0].textContent?.replace(/[^0-9]/g, '')
  );
};

const getTax = () => {
  const targetElement = document.querySelector<HTMLSpanElement>(
    '.js-validator-taxPrice'
  );
  if (!targetElement) return;
  return Number(targetElement.innerText);
};

const calculateDifference = (budget: string) => {
  const currentPrice = getCurrentPrice();

  const taxExcludedPrice = Math.round(
    (Number(budget) - (currentPrice ?? 0) - Number(shipping)) / 1.1
  );

  console.log(budget, currentPrice, Number(shipping), taxExcludedPrice);

  return taxExcludedPrice;
};

const setInputValue = async (value: number) => {
  const inputElement = document.querySelector<HTMLInputElement>(
    '.BidModal__inputPrice'
  );
  if (!inputElement) return;
  inputElement.value = String(value);
  inputElement.focus();

  return;
};

const Budget = () => {
  const createTextElement = (str: string) => {
    const span = document.createElement('span');
    span.textContent = str;
    return span;
  };

  const onInput = async (event: Event) => {
    const inputElement = event.composedPath()[0] as HTMLInputElement;
    const inputValue = inputElement.value;
    const taxExcludedPrice = calculateDifference(inputValue);
    if (taxExcludedPrice < 1) return;
    await setInputValue(taxExcludedPrice);
    await new Promise((resolve) => setTimeout(resolve, 100));

    inputElement.focus();

    /*     if (!inputValue) cookieManager.setCookie('');
      cookieManager.setCookie(inputValue); */
  };

  const onKeydown = (event: KeyboardEvent) => {
    const KeyboardEvent = event as KeyboardEvent;
    if (!isNumber(KeyboardEvent.key)) event.preventDefault();
  };

  const container = document.createElement('div');
  container.className = 'budget-container';

  const labelElement = document.createElement('label');
  labelElement.className = 'budget-label';

  const input = NumberInputForm('budget-input');
  input.addEventListener('keydown', onKeydown);
  input.addEventListener('input', onInput);

  labelElement.appendChild(input);
  labelElement.prepend(createTextElement('予算'));
  labelElement.appendChild(createTextElement('円'));

  container.appendChild(labelElement);
  return container;
};

document.querySelector('.BidModal__inputArea')?.prepend(Budget());

document
  .querySelector('.budget-input')
  ?.addEventListener('keydown', (event) => {
    const keyEvent = event as KeyboardEvent;
    if (!isNumber(keyEvent.key)) event.preventDefault();
  });

const shippingElement = () => {
  const dl = document.createElement('dl');
  dl.className = 'BidModal__subTotal';

  const dtTitle = document.createElement('dt');
  dtTitle.className = 'BidModal__left';
  dtTitle.textContent = '送料';

  const ddShipping = document.createElement('dd');
  ddShipping.className = 'BidModal__right';
  ddShipping.textContent = ': ' + shipping + ' 円';

  dl.append(dtTitle);
  dl.append(ddShipping);

  return dl;
};

document.querySelector('.BidModal__subTotal')?.prepend(shippingElement());

export {};
