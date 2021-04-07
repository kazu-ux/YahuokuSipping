
//送料込み価格と送料入力フォームの項目を追加する
const insertShippingForm = () => {
    document
        .querySelector(".Price__value")
        .insertAdjacentHTML("afterend",
            '<dt class="Price__title">送料・税込み価格</dt>' +
            '<dd class="Price__value" id="SumShipping">----円</dd>' +
            '<input type="number" name="shippingInput" value="">円')
}

//出品者が設定している送料を入力する
const setShipping = async () => {
    const shippingValue = await tryReturnShipping;
    console.log(shippingValue);
    const shippingForm = document.querySelector("dl > input[type=number]");
    shippingForm.setAttribute('value', shippingValue)
    sumShippingAndPrice();
}

//出品者が設定している送料を取得する
const tryReturnShipping = new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            const shipping = document.querySelector('.Price__postageValue--bold').textContent.replace(/,/g, '');
            resolve(shipping)
        } catch (error) {
            resolve('')
        }
    }, 2000);
});

//入力されている送料を現在価格と足し合わせる
const sumShippingAndPrice = () => {
    getInputValue();
    const shippingForm = document.querySelector("dl > input[type=number]");
    shippingForm.addEventListener('input', () => {
        getInputValue();
    })
}

//現在価格、または税込み価格を返す関数
const returnPrice = () => {
    const tax_price = document.querySelector('.Price__tax').textContent.replace(/[^0-9]/g, '');
    const str_price = document.querySelector('.Price__value').firstChild.data //○,○○○円
    const num_price = str_price.replace(/[,円]/g, '')
    if (tax_price === '0') {
        return num_price;
    } else {
        return tax_price;
    }
}

//入力ボックスの値を取得する
const getInputValue = () => {
    //合計金額を表示する場所
    const SumShippingArea = document.querySelector('#SumShipping');
    //送料を入力するボックスの場所
    const shippingForm = document.querySelector("dl > input[type=number]");
    console.log(getUnixTime());
    //setShippingToLocalStorage(shippingForm.value);
    const shippingPlusPrice = Number(shippingForm.value) + Number(returnPrice());
    SumShippingArea.textContent = String(shippingPlusPrice) + "円";
}



//LocalStorageに入力した送料を保存する
const setShippingToLocalStorage = (strShip) => {
    localStorage.setItem(getAuctionId() + "_Shipping", strShip);
    //localStorage.setItem('bar', 2);

    //console.log(localStorage.length);

    //console.log(localStorage.getItem('foo'));
}

//アクセスしているオークションIDを取得する
const getAuctionId = () => {
    const auctionId = document.querySelectorAll("dd.ProductDetail__description")[10].textContent.replace(/：/g, "");
    console.log(auctionId);
    return auctionId
}

//LocalStorageに保存した時間をUNIX時間で取得する
const getUnixTime = () => {
    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);
    return unixTime
}

//LocalStorageにアクセスして、送料が保存されているかを確認する
const tryGetShippingFromLocalstorage = () => {
    const shipping = localStorage.getItem(getAuctionId() + "_Shipping")
    if (shipping) {
        console.log(shipping);

    } else {
        console.log("保存されてない");

    }
}

const main = () => {
    insertShippingForm();
    setShipping();
    tryGetShippingFromLocalstorage();
}

//HTMLの読み込みが完了してから
//window.onload = main();
window.addEventListener('DOMContentLoaded', main());