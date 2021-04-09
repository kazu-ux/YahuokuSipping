
//送料込み価格と送料入力フォームの項目を追加する
const insertShippingForm = async () => {
    document
        .querySelector(".Price__value")
        .insertAdjacentHTML("afterend",
            '<dt class="Price__title">送料・税込み価格</dt>' +
            '<dd class="Price__value" id="SumShipping">----円</dd>' +
            '<input type="number" name="shippingInput" value="">円')
}

//Cookieに送料が保存されているかを確認する


//送料入力欄に数値を入れる
const setShippingToInputBox = (num) => {
    const shippingForm = document.querySelector("dl > input[type=number]");
    shippingForm.setAttribute('value', num)
}

//出品者が設定している送料を入力する
const getShipping = async () => {
    const shippingValue = await tryReturnShipping;
    setShippingToInputBox(shippingValue);
    //sumShippingAndPrice();
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
const sumShippingAndPrice = async () => {
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

//入力ボックスの値を取得して、合計金額を表示する
const getInputValue = () => {
    //合計金額を表示する場所
    const SumShippingArea = document.querySelector('#SumShipping');
    //送料を入力するボックスの場所
    const shippingForm = document.querySelector("dl > input[type=number]");
    const inputedShinnping = shippingForm.value;
    console.log(inputedShinnping);
    //tryGetShippingCookie(inputedShinnping);
    const shippingPlusPrice = Number(inputedShinnping) + Number(returnPrice());
    SumShippingArea.textContent = String(shippingPlusPrice) + "円";
}

//アクセスしているオークションIDを取得する
const getAuctionId = () => {
    const auctionId = document.querySelectorAll("dd.ProductDetail__description")[10].textContent.replace(/：/g, "");
    console.log(auctionId);
    return auctionId
}

//現在時刻をUnixtimeで返す
const getUnixTime = () => {
    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);
    return unixTime
}

//Cookieに送料が保存されているかを確認する
const tryGetShippingCookie = (shipping) => {
    const name = getAuctionId() + "_shipping"
    //console.log(shipping)
    chrome.runtime.sendMessage({ name: name, url: "https://page.auctions.yahoo.co.jp/", value: shipping, expirationDate: getUnixTime() + 600 });
}

chrome.runtime.onMessage.addListener((shipping) => {
    //console.log(shipping);
    return true
})

const main = async () => {
    await insertShippingForm();
    await getShipping();
    await sumShippingAndPrice()
    //tryGetShippingCookie("1900");
    //setCookie();
}

//HTMLの読み込みが完了してから
//window.onload = main();
window.addEventListener('DOMContentLoaded', main());