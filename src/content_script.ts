(() => {
  //送料込み価格と送料入力フォームの項目を追加する
  const insertShippingForm = async () => {
    document
      .querySelector('.Price__value')!
      .insertAdjacentHTML(
        'afterend',
        '<dt class="Price__title ys">送料・税込み価格</dt>' +
          '<dd class="Price__value ys" id="SumShipping">----円</dd>' +
          '<input type="number" id="shippingInput" value="">円'
      );
  };

  const Price = (shipping: number) => {
    const getCurrentPrice = () => {
      const targetElement = document.querySelector('.Price__value')!;
      return Number(
        targetElement.childNodes[0].textContent!.replace(/[^0-9]/g, '')
      );
    };
    const getTax = () => {
      const targetElement = document.querySelector('.Price__value')!;
      return Number(
        targetElement.childNodes[1].textContent!.replace(/[^0-9]/g, '')
      );
    };

    const currentPrice = getCurrentPrice();
    const tax = getTax();
    const totalPrice = currentPrice + tax + shipping;

    console.log(currentPrice, shipping, totalPrice);
    return {
      sumPrice: () => {
        return totalPrice;
      },
      setTotalPrice: () => {
        document.querySelector('#SumShipping')!.textContent =
          String(totalPrice) + '円';
      },
      setShipping: () => {
        (document.querySelector('#shippingInput') as HTMLInputElement).value =
          String(shipping);
      },
    };
  };

  //Cookieに送料が保存されているかを確認する
  const tryGetShippingCookie = async () => {
    const name = getAuctionId() + '_shipping';
    const auctioURL = getAuctionUrl();

    chrome.runtime.sendMessage(
      {
        name: name,
        url: 'https://page.auctions.yahoo.co.jp/',
      },
      (shipping: number | undefined | null) => {
        const bar = Price(Number(shipping));

        console.log(bar.sumPrice());
        //
        bar.setShipping();
        bar.setTotalPrice();
        console.log(shipping);
      }
    );
  };

  //送料入力欄に数値を入れる
  const setShippingToInputBox = (num: number) => {
    const shippingForm = document.querySelector('dl > input[type=number]')!;
    shippingForm.setAttribute('value', String(num));
  };

  //出品者が設定している送料を取得する
  const getShipping = async () => {
    const shippingValue = await tryReturnShipping;
    return shippingValue;
  };

  //出品者が設定している送料を取得する
  const tryReturnShipping = new Promise((resolve, reject) => {
    setTimeout(() => {
      const shippingEle = document.querySelector('.Price__postageValue')!;
      //送料無料の場合
      if (shippingEle.textContent === '無料') {
        resolve('0');
      }
      //全国一律の場合
      else if (shippingEle.textContent!.match(/全国一律/)) {
        resolve(
          document
            .querySelector('.Price__postageValue > .Price__postageValue')!
            .textContent!.replace(/,/g, '')
        );
      }
      //地域ごとの送料が設定されている場合
      else if (shippingEle.textContent!.match(/[は円]/)) {
        resolve(
          document
            .querySelector('.Price__postageValue > .Price__postageValue')!
            .textContent!.replace(/,/g, '')
        );
      }
      //送料未設定の場合
      else {
        resolve('');
      }
    }, 2000);
  });

  //入力されている送料を現在価格と足し合わせて、表示する
  const sumShippingAndPrice = async (inputedShinnping: any) => {
    //合計金額を表示する場所
    const SumShippingArea = document.querySelector('#SumShipping')!;
    //現在価格と送料を足す
    const shippingPlusPrice = Number(inputedShinnping) + Number(returnPrice());
    //金額にカンマを入れる
    const priceInToComma = shippingPlusPrice.toLocaleString();
    //送料込み価格を表示する
    SumShippingArea.textContent = String(priceInToComma) + '円';
  };

  //現在価格、または税込み価格を返す関数
  const returnPrice = () => {
    const tax_price = document
      .querySelector('.Price__tax')!
      .textContent!.replace(/[^0-9]/g, '');
    const str_price = (
      document.querySelector('.Price__value')!.firstChild! as any
    ).data; //○,○○○円
    const num_price = str_price.replace(/[,円]/g, '');
    if (tax_price === '0') {
      return num_price;
    } else {
      return tax_price;
    }
  };

  //アクセスしているオークションIDを取得する
  const getAuctionId = () => {
    const auctionId = location.href.split('/')[5];
    return auctionId;
  };

  const getAuctionUrl = () => {
    const auctionUrl = location.href;
    return auctionUrl;
  };

  //現在時刻をUnixtimeで返す
  const getUnixTime = () => {
    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);
    return unixTime;
  };

  //Cookieに入力している送料を保存する
  const setShippingToCookies = async (shipping: any) => {
    const name = getAuctionId() + '_shipping';
    chrome.runtime.sendMessage({
      name: name,
      url: 'https://page.auctions.yahoo.co.jp/',
      value: shipping,
      expirationDate: getUnixTime() + 604800,
    });
  };

  //Cookieに送料が保存されていれば、その送料を入力ボックスに挿入する。
  //されていなければ、出品者が設定している送料を入力ボックスに挿入する。
  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.isCookie) {
      setShippingToInputBox(message.shipping);
    } else {
      setShippingToInputBox((await getShipping()) as any);
    }

    return true;
  });

  const main = async () => {
    console.log('test');

    // 送料入力フォームを追加する
    await insertShippingForm();
    await tryGetShippingCookie();

    document
      .querySelector('#shippingInput')!
      .addEventListener('input', (event) => {
        const inputELement = event.composedPath()[0] as HTMLInputElement;
        const inputvalue = inputELement.value;

        Price(Number(inputvalue)).setTotalPrice();
      });
  };

  //HTMLの読み込みが完了してから
  window.addEventListener('load', main);
})();
