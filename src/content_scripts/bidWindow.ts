import { getTaxRate } from '../functional/get_tax_rate';
import { isNumber } from '../functional/is_number';

import { NumberInputForm } from './ui/number_input_form';

export const bidWindow = async () => {
  const getShipping = () =>
    document.querySelector<HTMLInputElement>('.shipping-input')?.value;

  const getTaxExcludedPrice = (budget: string) => {
    const taxRate = getTaxRate();
    const taxExcludedPrice = Math.round(
      (Number(budget) - Number(getShipping())) / (1 + taxRate / 100)
    );

    return taxExcludedPrice;
  };

  const calculateBidPrice = () => {
    const budget =
      document.querySelector<HTMLInputElement>('.budget-input')?.value;
    if (!budget) return 0;
    const shipping = Number(getShipping());
    const taxExcludedPrice = getTaxExcludedPrice(budget);
    return taxExcludedPrice;
  };

  const toggleLimitPriceMessage = (taxExcludedPrice: number) => {
    const limitPriceElement = document.querySelector<HTMLParagraphElement>(
      '.js-validator-error-priceLimit'
    );
    if (!limitPriceElement) return;
    const limitPrice = limitPriceElement.innerText.replace(/[^0-9]/g, '');
    console.log({ limitPrice });

    if (taxExcludedPrice < Number(limitPrice)) {
      limitPriceElement.style.display = 'block';
    } else {
      limitPriceElement.style.display = '';
    }
  };

  const setInputValue = async (bidPrice: number) => {
    const bidPriceInput = document.querySelector<HTMLInputElement>(
      '.BidModal__inputPrice'
    );
    if (!bidPriceInput) return;
    bidPriceInput.value = String(bidPrice);
    bidPriceInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    return;
  };
  const createTextElement = (str: string) => {
    const span = document.createElement('span');
    span.textContent = str;
    return span;
  };
  const createBudgetContainer = () => {
    let timer: number;

    const onInput = async () => {
      window.clearTimeout(timer);

      timer = window.setTimeout(async () => {
        const bidPrice = calculateBidPrice();
        const taxRate = getTaxRate();

        const tax = Math.round(bidPrice * (taxRate / 100));

        toggleLimitPriceMessage(bidPrice);
        await setInputValue(bidPrice);

        const totalPriceElement = document.querySelector('.total-price');
        if (!totalPriceElement) return;

        totalPriceElement.textContent =
          ': ' + (bidPrice + tax + Number(getShipping())) + ' 円';
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

  document
    .querySelector('.BidModal__inputArea')
    ?.prepend(createBudgetContainer());

  const createShippingElement = () => {
    const dl = document.createElement('dl');
    dl.className = 'BidModal__subTotal';

    const dtTitle = document.createElement('dt');
    dtTitle.className = 'BidModal__left';
    dtTitle.textContent = '送料';

    const ddShipping = document.createElement('dd');
    ddShipping.className = 'BidModal__right shipping';

    dl.append(dtTitle);
    dl.append(ddShipping);

    return dl;
  };
  document
    .querySelector('.BidModal__subTotal')
    ?.prepend(createShippingElement());

  const createTotalPriceElement = () => {
    const dl = document.createElement('dl');
    dl.className = 'total-price-container';

    const dtTitle = document.createElement('dt');
    dtTitle.className = 'BidModal__left';
    dtTitle.textContent = '送料込み価格';

    const ddTotalPrice = document.createElement('dd');
    ddTotalPrice.className = 'BidModal__right total-price';
    ddTotalPrice.textContent = ': ' + '----' + ' 円';

    dl.append(dtTitle);
    dl.append(ddTotalPrice);

    return dl;
  };

  document
    .querySelector('.BidModal__totalArea')
    ?.append(createTotalPriceElement());

  const options = {
    root: null,
    rootMargin: '10px',
    threshold: 0,
  };

  const callback = (entries: IntersectionObserverEntry[]) => {
    if (!entries[0].isIntersecting) return;
    const shippingElement = document.querySelector<HTMLElement>('.shipping');
    if (!shippingElement) return;
    shippingElement.textContent = getShipping() ?? '';
    const bidPrice = calculateBidPrice();
    setInputValue(bidPrice);
    console.log('test');
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(document.querySelector('.budget-container')!);
};
