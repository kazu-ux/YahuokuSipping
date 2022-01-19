/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*******************************!*\
  !*** ./src/content_script.ts ***!
  \*******************************/

(() => {
    //送料込み価格と送料入力フォームの項目を追加する
    const insertShippingForm = async () => {
        document
            .querySelector('.Price__value')
            .insertAdjacentHTML('afterend', '<dt class="Price__title ys">送料・税込み価格</dt>' +
            '<dd class="Price__value ys" id="SumShipping">----円</dd>' +
            '<input type="number" id="shippingInput" value="">円');
    };
    const Price = (shipping) => {
        const getCurrentPrice = () => {
            const targetElement = document.querySelector('.Price__value');
            return Number(targetElement.childNodes[0].textContent.replace(/[^0-9]/g, ''));
        };
        const getTaxIncludedPrice = () => {
            const targetElement = document.querySelector('.Price__value');
            return Number(targetElement.childNodes[1].textContent.replace(/[^0-9]/g, ''));
        };
        const currentPrice = getCurrentPrice();
        const taxIncludedPrice = getTaxIncludedPrice();
        const price = Math.max(currentPrice, taxIncludedPrice);
        const totalPrice = price + shipping;
        console.log(currentPrice, shipping, totalPrice);
        return {
            sumPrice: () => {
                return totalPrice;
            },
            setTotalPrice: () => {
                document.querySelector('#SumShipping').textContent =
                    String(totalPrice) + '円';
            },
            setShipping: () => {
                const targetElement = document.querySelector('#shippingInput');
                targetElement.value = String(shipping);
                // targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            },
        };
    };
    //Cookieに送料が保存されているかを確認する
    const tryGetShippingCookie = async () => {
        const name = getAuctionId() + '_shipping';
        chrome.runtime.sendMessage({
            name: name,
            url: 'https://page.auctions.yahoo.co.jp/',
            // expirationDate: getUnixTime() + 604800,
        }, (shipping) => {
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
        });
    };
    //出品者が設定している送料を取得する
    const getSellerShipping = () => {
        const shipping = document.querySelector('.Price__postageValue')
            ?.textContent;
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
    //現在時刻をUnixtimeで返す
    const getUnixTime = () => {
        const date = new Date();
        const unixTime = Math.floor(date.getTime() / 1000);
        return unixTime;
    };
    //Cookieに入力している送料を保存する
    const setShippingToCookies = async (shipping) => {
        const name = getAuctionId() + '_shipping';
        chrome.runtime.sendMessage({
            name: name,
            url: 'https://page.auctions.yahoo.co.jp/',
            value: shipping,
            //  expirationDate: getUnixTime() + 604800,
        });
    };
    const main = async () => {
        console.log('test');
        // 送料入力フォームを追加する
        await insertShippingForm();
        await tryGetShippingCookie();
        document
            .querySelector('#shippingInput')
            .addEventListener('input', (event) => {
            const inputELement = event.composedPath()[0];
            const inputvalue = inputELement.value;
            const name = getAuctionId() + '_shipping';
            chrome.runtime.sendMessage({
                name: name,
                url: 'https://page.auctions.yahoo.co.jp/',
                value: inputvalue,
            });
            Price(Number(inputvalue)).setTotalPrice();
            console.log('inputEvent');
        });
    };
    //HTMLの読み込みが完了してから
    window.addEventListener('load', main);
})();

/******/ })()
;