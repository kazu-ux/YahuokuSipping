
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
}

//入力されている送料を現在価格と足し合わせる
const sumShippingAndPrice = () => {
    //getInputValue();
    shippingForm.addEventListener('input', () => {
        //getInputValue();
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
    const SumShippingArea = document.querySelector('#SumShipping');
    const shippingForm = document.querySelector("dl > input[type=number]");
    shippingToLocalStorage(Number(shippingForm.value));
    const shippingPlusPrice = Number(shippingForm.value) + Number(returnPrice());
    SumShippingArea.textContent = String(shippingPlusPrice) + "円";
}

//出品者が設定している送料を取得する
const tryReturnShipping = new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            const shipping = document.querySelector('.Price__postageValue').children[1].textContent.replace(/,/g, '');
            resolve(shipping)
        } catch (error) {
            resolve('0')
        }
    }, 2000);
});

//MutationObserverを使って、送料が表示されたら送料をリターンする
const returnShippingMO = async () => {
    const shippingEle = document.getElementsByClassName("Price__postageValue")[0];
    const observer = new MutationObserver((mutations) => {

        mutations.forEach((mutation) => {
            console.log(mutation.target.childNodes[2].textContent.replace(/,/g, '') + "MO");
            return (mutation.target.childNodes[2].textContent.replace(/,/g, ''));
        });
    });

    const config = { attributes: true, childList: true, characterData: true };

    observer.observe(shippingEle, config);

    setTimeout(() => {
        observer.disconnect();
    }, 10000);
};

//LocalStorageに入力した送料を保存する
const shippingToLocalStorage = (num) => {
    localStorage.setItem('shipping', num);
    //localStorage.setItem('bar', 2);

    //console.log(localStorage.length);

    //console.log(localStorage.getItem('foo'));
}

const main = () => {
    insertShippingForm();
    setShipping();
    //shippingToLocalStorage();
    //returnShipping();
}

//HTMLの読み込みが完了してから
//window.onload = main();
window.addEventListener('DOMContentLoaded', main());