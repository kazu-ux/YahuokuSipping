import { CookieManager } from './content_scripts/cookie/CookieManager';
import { NumberInputForm } from './content_scripts/ui/number_input_form';
import './css/style.css';
import { getAuctionId } from './functional/get_auction_id';
import { isNumber } from './functional/is_number';

const cookieManager = CookieManager(getAuctionId());

const createShippingContainer = () => {
  const onInput = async (event: Event) => {
    const inputELement = event.composedPath()[0] as HTMLInputElement;
    const inputValue = inputELement.value;
    console.log(inputValue);

    if (!inputValue) cookieManager.setCookie('');
    cookieManager.setCookie(inputValue);

    Price(Number(inputValue)).setTotalPrice();
  };

  const onKeydown = (event: KeyboardEvent) => {
    const KeyboardEvent = event as KeyboardEvent;
    if (!isNumber(KeyboardEvent.key)) event.preventDefault();
  };

  const div = document.createElement('div');
  div.className = 'shipping-container';

  const dt = document.createElement('dt');
  dt.className = 'Price__title ys';
  dt.textContent = '送料・税込み価格';

  const dd = document.createElement('dd');
  dd.className = 'Price__value ys';
  dd.id = 'SumShipping';
  dd.textContent = '----円';

  const input = NumberInputForm('shipping-input');
  input.addEventListener('keydown', onKeydown);
  input.addEventListener('input', onInput);

  const span = document.createElement('span');
  span.textContent = '円';
  const shippingForm = document.createElement('div');
  shippingForm.className = 'shipping-form';
  shippingForm.appendChild(input);
  shippingForm.appendChild(span);

  div.appendChild(dt);
  div.appendChild(dd);
  div.appendChild(shippingForm);

  return div;
};

//送料込み価格と送料入力フォームの項目を追加する
const insertShippingForm = async () => {
  document
    .querySelector('.Price__row')
    ?.insertAdjacentElement('afterend', createShippingContainer());
};

const Price = (shipping: number) => {
  const getCurrentPrice = () => {
    const targetElement = document.querySelector('.Price__value');
    if (!targetElement) return;
    return Number(
      targetElement.childNodes[0].textContent?.replace(/[^0-9]/g, '')
    );
  };
  const getTaxIncludedPrice = () => {
    const targetElement = document.querySelector('.Price__value');
    if (!targetElement) return;
    return Number(
      targetElement.childNodes[1].textContent?.replace(/[^0-9]/g, '')
    );
  };

  const currentPrice = getCurrentPrice() ?? 0;

  const taxIncludedPrice = getTaxIncludedPrice() ?? 0;
  const price = Math.max(currentPrice, taxIncludedPrice); // 税があるかどうかを判断する
  const totalPrice = price + shipping;

  console.log(currentPrice, shipping, totalPrice);
  return {
    sumPrice: () => {
      return totalPrice;
    },
    setTotalPrice: () => {
      const targetElement = document.querySelector('#SumShipping');
      if (!targetElement) return;
      targetElement.textContent = totalPrice.toLocaleString() + '円';
    },
    setShipping: () => {
      const targetElement =
        document.querySelector<HTMLInputElement>('.shipping-input');
      if (targetElement) targetElement.value = String(shipping);
    },
  };
};

//出品者が設定している送料を取得する
const getSellerShipping = () => {
  const shipping = document.querySelector('.Price__postageValue')?.textContent;
  if (!shipping) return '';
  if (shipping.includes('無料')) {
    return '0';
  }
  if (shipping.includes('着払い')) {
    return '';
  }
  const shippingPrice = shipping.replace(/[^0-9]/g, '');
  return shippingPrice;
};

const setInputShipping = (shipping: string) => {
  const inputElement =
    document.querySelector<HTMLInputElement>('.shipping-input');
  if (!inputElement) return;
  inputElement.value = shipping;
  inputElement.dispatchEvent(new Event('input', { bubbles: true }));
};

const main = async () => {
  // 送料入力フォームを追加する
  await insertShippingForm();
  const cookie = await cookieManager.getCookie();
  if (!cookie) return setInputShipping(getSellerShipping());
  setInputShipping(cookie.value);
};

//HTMLの読み込みが完了してから
window.addEventListener('load', main);

export {};
