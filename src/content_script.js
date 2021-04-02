
//送料込み価格の項目を追加する
const addShipping = () => {
    document
        .querySelector(".Price__value")
        .insertAdjacentHTML("afterend",
            '<dt class="Price__title">送料込み価格</dt>' +
            '<dd class="Price__value" id="SumShipping">----円</dd>' +
            '<input type="number" name="shipping" value="">円')
}

//HTMLの読み込みが完了してから
document.addEventListener('DOMContentLoaded', addShipping());

//送料を入力するフォームを作る
const shippingForm = document.querySelector("dl > input[type=number]");
console.log(shippingForm);
shippingForm.addEventListener('input', () => {
    const SumShippingArea = document.querySelector('#SumShipping');
    const shippingPlusPrice = Number(shippingForm.value) + Number(getPrice());
    SumShippingArea.textContent = String(shippingPlusPrice) + "円";
})

//現在価格を取得する関数
const getPrice = () => {
    const str_price = document.querySelector('.Price__value').firstChild.data //○,○○○円
    const num_price = str_price.replace(/[,円]/g, '')
    return (num_price);
}