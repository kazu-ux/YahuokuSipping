import './css/style.css';

//送料込み価格と送料入力フォームの項目を追加する
const insertShippingForm = async () => {
  document
    .querySelector('.Price__value')
    ?.insertAdjacentHTML(
      'afterend',
      '<div><dt class="Price__title ys">送料・税込み価格</dt>' +
        '<dd class="Price__value ys" id="SumShipping">----円</dd>' +
        '<input type="number" id="shippingInput" value="">円</div>'
    );
  document
    .querySelector('#shippingInput')
    ?.addEventListener('keydown', (event) => {
      const NGKey = ['e', '.', '+', '-'];
      const KeyboardEvent = event as KeyboardEvent;
      const inputKey = KeyboardEvent.key;
      if (NGKey.includes(inputKey)) event.preventDefault();
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
        document.querySelector<HTMLInputElement>('#shippingInput');
      if (targetElement) targetElement.value = String(shipping);
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
    .querySelector<HTMLInputElement>('#shippingInput')
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

main();
export {};
