import { getAuctionId } from '../functional/get_auction_id';

import { getTaxRate } from '../functional/get_tax_rate';
import { isNumber } from '../functional/is_number';
import { CookieManager } from './cookie/CookieManager';
import { NumberInputForm } from './ui/number_input_form';

const cookieManager = CookieManager(getAuctionId());
const shipping = (await cookieManager.getCookie())?.value;

const calculateDifference = (budget: string) => {
  const taxRate = getTaxRate();
  const taxExcludedPrice = Math.round(
    (Number(budget) - Number(shipping)) / (1 + taxRate / 100)
  );

  return taxExcludedPrice;
};

const getBidPriceInput = () => {
  const inputElement = document.querySelector<HTMLInputElement>(
    '.BidModal__inputPrice'
  );
  return inputElement;
};

const toggleLimitPriceMessage = (taxExcludedPrice: number) => {
  const limitPriceElement = document.querySelector<HTMLParagraphElement>(
    '.js-validator-error-priceLimit'
  );
  if (!limitPriceElement) return;
  const limitPrice = limitPriceElement.innerText.replace(/[^0-9]/g, '');
  console.log(limitPrice);

  if (taxExcludedPrice < Number(limitPrice)) {
    limitPriceElement.style.display = 'block';
  } else {
    limitPriceElement.style.display = '';
  }
};

const setInputValue = async (bidPrice: number) => {
  const bidPriceInput = getBidPriceInput();
  if (!bidPriceInput) return;
  bidPriceInput.value = String(bidPrice);
  bidPriceInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));

  return;
};

const Budget = () => {
  const createTextElement = (str: string) => {
    const span = document.createElement('span');
    span.textContent = str;
    return span;
  };

  let timer: number;

  const onInput = async (event: Event) => {
    window.clearTimeout(timer);

    const budgetInput = event.composedPath()[0] as HTMLInputElement;

    timer = window.setTimeout(async () => {
      const budgetPrice = budgetInput.value;
      const taxExcludedPrice = calculateDifference(budgetPrice);
      const taxRate = getTaxRate();
      const tax = Math.round(taxExcludedPrice * (taxRate / 100));
      console.log({ budgetPrice, taxExcludedPrice });

      toggleLimitPriceMessage(taxExcludedPrice);
      await setInputValue(taxExcludedPrice);

      const totalPriceElement = document.querySelector('.total-price');
      if (!totalPriceElement) return;

      totalPriceElement.textContent =
        ': ' + (taxExcludedPrice + tax + Number(shipping)) + ' 円';
    }, 500);

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

const totalPriceElement = (price?: number) => {
  const dl = document.createElement('dl');
  dl.className = 'total-price-container';

  const dtTitle = document.createElement('dt');
  dtTitle.className = 'BidModal__left';
  dtTitle.textContent = '送料込み価格';

  const ddTotalPrice = document.createElement('dd');
  ddTotalPrice.className = 'BidModal__right total-price';
  ddTotalPrice.textContent = ': ' + (price ?? '----') + ' 円';

  dl.append(dtTitle);
  dl.append(ddTotalPrice);

  return dl;
};

document.querySelector('.BidModal__totalArea')?.append(totalPriceElement());

export {};
