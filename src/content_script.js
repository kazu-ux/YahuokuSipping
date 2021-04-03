
//送料込み価格の項目と送料入力ボックスを追加する
const addShipping = () => {
    document
        .querySelector(".Price__value")
        .insertAdjacentHTML("afterend",
            '<dt class="Price__title">送料・税込み価格</dt>' +
            '<dd class="Price__value" id="SumShipping">----円</dd>')
}

//送料を入力するフォームを作る
const createShippingForm = () => {
    document.querySelector('#SumShipping').insertAdjacentHTML('afterend', `<input type="number" name="shipping" value="${returnShipping()}">円`)
    const shippingForm = document.querySelector("dl > input[type=number]");
    getInputValue();
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
    const SumShippingArea = document.querySelector('#SumShipping');
    const shippingForm = document.querySelector("dl > input[type=number]");
    shippingToLocalStorage(Number(shippingForm.value));
    const shippingPlusPrice = Number(shippingForm.value) + Number(returnPrice());
    SumShippingArea.textContent = String(shippingPlusPrice) + "円";
}

//出品者が設定している送料を取得する
const returnShipping = () => {
    try {
        const shipping = document.querySelector(".Price__postageValue").children[1].textContent.replace(/,/g, '');
        return shipping
    } catch (error) {
        return "0"
    }
}

//LocalStorageに入力した送料を保存する
const shippingToLocalStorage = (num) => {
    localStorage.setItem('shipping', num);
    //localStorage.setItem('bar', 2);

    //console.log(localStorage.length);

    //console.log(localStorage.getItem('foo'));
}

const main = () => {
    addShipping();
    createShippingForm();
    //shippingToLocalStorage();
}

//HTMLの読み込みが完了してから
document.addEventListener('load', main());