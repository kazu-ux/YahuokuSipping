import { NumberInputForm } from './content_scripts/ui/number_input_form';
import './css/style.css';
import { isNumber } from './functional/is_number';

const createShippingContainer = () => {
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
  const title = document.createElement('dt');
  title.className = 'Price__title ys';

  document
    .querySelector('.Price__row')
    ?.insertAdjacentElement('afterend', createShippingContainer());
  document
    .querySelector('.shipping-input')
    ?.addEventListener('keydown', (event) => {
      const KeyboardEvent = event as KeyboardEvent;
      if (!isNumber(KeyboardEvent.key)) event.preventDefault();
    });
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
      // targetElement.dispatchEvent(new Event('input', { bubbles: true }));
    },
  };
};

const cookieManager = async () => {
  const name = getAuctionId() + '_shipping';

  chrome.runtime.sendMessage(
    {
      name: name,
      url: 'https://page.auctions.yahoo.co.jp/',
    },
    (shipping: number | undefined | null) => {
      const sellerShipping = getSellerShipping();
      console.log(sellerShipping);
      if (!shipping && !sellerShipping) {
        Price(Number(shipping)).setTotalPrice();
        return;
      }
      if (!shipping && sellerShipping) {
        const price = Price(Number(sellerShipping));
        price.setShipping();
        price.setTotalPrice();

        return;
      }

      const price = Price(Number(shipping));
      price.setShipping();
      price.setTotalPrice();
      console.log(shipping);
    }
  );
};

//出品者が設定している送料を取得する
const getSellerShipping = () => {
  const shipping = document.querySelector('.Price__postageValue')?.textContent;
  if (!shipping) return;
  if (shipping.includes('無料')) {
    return '0';
  }
  if (shipping.includes('着払い')) {
    return;
  }
  const shippingPrice = shipping.replace(/[^0-9]/g, '');
  return shippingPrice;
};

//アクセスしているオークションIDを取得する
const getAuctionId = () => {
  const auctionId = location.href.split('/')[5];
  return auctionId;
};

const main = async () => {
  // 送料入力フォームを追加する
  await insertShippingForm();
  await cookieManager();

  document
    .querySelector<HTMLInputElement>('.shipping-input')
    ?.addEventListener('input', (event) => {
      const inputELement = event.composedPath()[0] as HTMLInputElement;
      const inputvalue = inputELement.value;

      const name = getAuctionId() + '_shipping';

      chrome.runtime.sendMessage({
        name: name,
        url: 'https://page.auctions.yahoo.co.jp/',
        value: inputvalue,
      });
      Price(Number(inputvalue)).setTotalPrice();
    });
};

//HTMLの読み込みが完了してから
window.addEventListener('load', main);

export {};
