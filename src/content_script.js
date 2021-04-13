
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
const tryGetShippingCookie = async () => {
    const name = getAuctionId() + "_shipping"
    chrome.runtime.sendMessage(message = { name: name, url: "https://page.auctions.yahoo.co.jp/", auctionUrl: getAuctionUrl() });
}

//送料入力欄に数値を入れる
const setShippingToInputBox = (num) => {
    const shippingForm = document.querySelector("dl > input[type=number]");
    shippingForm.setAttribute('value', num)
}

//送料入力ボックスを監視する
const monitorShippingInput = async () => {
    const input = document.querySelector("dl > input[type=number]");
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const savedShipping = mutation.target.value
            setShippingToCookies(savedShipping);
            sumShippingAndPrice(savedShipping);
            observer.disconnect();
        })
    })
    const config = { attributes: true, characterData: true };

    observer.observe(input, config);

    input.addEventListener("input", () => {
        sumShippingAndPrice(getInputValue());
    });
}

//出品者が設定している送料を取得する
const getShipping = async () => {
    const shippingValue = await tryReturnShipping;
    return shippingValue
}

//出品者が設定している送料を取得する
const tryReturnShipping = new Promise((resolve, reject) => {
    setTimeout(() => {
        const shippingEle = document.querySelector('.Price__postageValue');
        //送料無料の場合
        if (shippingEle.textContent === "無料") {
            resolve("0");
        }
        //全国一律の場合
        else if (shippingEle.textContent.match(/全国一律/)) {
            resolve(document.querySelector(".Price__postageValue > .Price__postageValue").textContent.replace(/,/g, ""));
        }
        //地域ごとの送料が設定されている場合
        else if (shippingEle.textContent.match(/[は円]/)) {
            resolve(document.querySelector(".Price__postageValue > .Price__postageValue").textContent.replace(/,/g, ""));
        }
        //送料未設定の場合
        else {
            resolve("");
        }
    }, 2000);
});

//入力されている送料を現在価格と足し合わせて、表示する
const sumShippingAndPrice = async (inputedShinnping) => {
    //合計金額を表示する場所
    const SumShippingArea = document.querySelector('#SumShipping');
    //現在価格と送料を足す
    const shippingPlusPrice = Number(inputedShinnping) + Number(returnPrice());
    //金額にカンマを入れる
    const priceInToComma = shippingPlusPrice.toLocaleString();
    //送料込み価格を表示する
    SumShippingArea.textContent = String(priceInToComma) + "円";
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
    setShippingToCookies(inputedShinnping);
    return inputedShinnping
}

//アクセスしているオークションIDを取得する
const getAuctionId = () => {
    const auctionId = document.querySelectorAll("dd.ProductDetail__description")[10].textContent.replace(/：/g, "");
    return auctionId
}

const getAuctionUrl = () => {
    const auctionUrl = location.href;
    return auctionUrl
}

//現在時刻をUnixtimeで返す
const getUnixTime = () => {
    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);
    return unixTime
}

//Cookieに入力している送料を保存する
const setShippingToCookies = async (shipping) => {
    const name = getAuctionId() + "_shipping"
    chrome.runtime.sendMessage({ name: name, url: "https://page.auctions.yahoo.co.jp/", value: shipping, expirationDate: getUnixTime() + 259200 });
}

//Cookieに送料が保存されていれば、その送料を入力ボックスに挿入する。
//されていなければ、出品者が設定している送料を入力ボックスに挿入する。
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.isCookie) {
        setShippingToInputBox(message.shipping);
    } else {
        setShippingToInputBox(await getShipping());
    }

    return true
})

const main = async () => {
    await insertShippingForm();
    await monitorShippingInput();
    await tryGetShippingCookie();
}

//HTMLの読み込みが完了してから
window.addEventListener('DOMContentLoaded', main());