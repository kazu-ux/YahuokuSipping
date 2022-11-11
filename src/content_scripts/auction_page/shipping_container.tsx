import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';

import { getAuctionId } from '../../functional/get_auction_id';
import { isNumber } from '../../functional/is_number';
import { CookieManager } from '../cookie/CookieManager';

const cookieManager = CookieManager(getAuctionId(), 'shipping');

const ShippingContainer = () => {
  const getSellerShipping = () => {
    const shipping = document.querySelector(
      '.Price__postageValue'
    )?.textContent;
    if (!shipping) return '';
    if (shipping.includes('無料')) {
      return '0';
    }
    if (shipping.includes('着払い')) {
      return '';
    }
    const shippingPrice = shipping.replace(/[^0-9]/g, '');
    return shippingPrice;
  };

  const calculateTotalPrice = (shipping: string) => {
    const currentPrice = document
      .querySelector('.Price__row .Price__value')
      ?.childNodes[0].textContent?.replace(/[^0-9]/g, '');

    const taxIncludedPrice = document
      .querySelector('.Price__row .Price__value')
      ?.childNodes[1].textContent?.replace(/[^0-9]/g, '');

    const totalPrice =
      Math.max(Number(currentPrice), Number(taxIncludedPrice)) +
      Number(shipping);
    return totalPrice;
  };

  const [totalPrice, setTotalPrice] = useState('----');
  const [shipping, setShipping] = useState('');

  useEffect(() => {
    (async () => {
      const cookieShipping = (await cookieManager.getCookie())?.value;
      const sellerShipping = getSellerShipping();

      if (!cookieShipping) {
        setShipping(sellerShipping);
        return;
      }
      setShipping(cookieShipping);
    })();
  }, []);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(shipping).toLocaleString());
  }, [shipping]);

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    const inputShipping = inputElement.value;

    cookieManager.setCookie(inputShipping);
    setShipping(inputShipping);
    console.log({ inputShipping, shipping, totalPrice });
  };

  const onKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    const KeyboardEvent = event;

    if (!isNumber(KeyboardEvent.key)) event.preventDefault();
  };
  return (
    <div className="shipping-container">
      <dt className="Price__title">送料・税込み価格</dt>
      <dd id="SumShipping" className="Price__value">
        {totalPrice}円
      </dd>
      <div className="shipping-form">
        <input
          className="shipping-input"
          type={'number'}
          onInput={onInput}
          onKeyDown={onKeydown}
          value={shipping}
        ></input>
        <span>円</span>
      </div>
    </div>
  );
};

export default ShippingContainer;
