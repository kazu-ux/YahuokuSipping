import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';

import { getAuctionId } from '../../functional/get_auction_id';
import { getTaxRate } from '../../functional/get_tax_rate';
import { isNumber } from '../../functional/is_number';
import { CookieManager } from '../cookie/CookieManager';
import ShippingRow from './shipping_row';
import TotalPriceRow from './total_price_row';

const cookieManager = CookieManager(getAuctionId(), 'budget');

const BudgetContainer = () => {
  const onInput = async (event: FormEvent<HTMLInputElement>) => {
    const inputBudget = (event.target as HTMLInputElement).value;
    setBudget(inputBudget);
    cookieManager.setCookie(inputBudget);
  };

  const onKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isNumber(event.key)) event.preventDefault();
  };

  const [budget, setBudget] = useState('');
  const [bidPrice, setBidPrice] = useState(0);
  const [shipping, setShipping] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const getShipping = () =>
    document.querySelector<HTMLInputElement>('.shipping-input')?.value;

  const calculateTaxExcludedPrice = (budget: string) => {
    const taxRate = getTaxRate();
    const shipping = getShipping();
    const taxExcludedPrice = Math.ceil(
      (Number(budget) - Number(shipping)) / (1 + taxRate / 100)
    );

    return taxExcludedPrice;
  };
  const calculateTotalPrice = (bidPrice: number, shipping: number) => {
    const taxRate = getTaxRate();
    const taxIncludedPrice = Math.floor(bidPrice * (1 + taxRate / 100));
    const totalPrice = taxIncludedPrice + shipping;

    console.log({ taxRate, taxIncludedPrice, totalPrice });

    return totalPrice;
  };

  useEffect(() => {
    const budgetContainer = document.querySelector('.budget-container');
    if (!budgetContainer) return;

    const options = {
      root: null,
      rootMargin: '10px',
      threshold: 0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (!entries[0].isIntersecting) {
        setBudget('0');
        setShipping('0');
        return;
      }
      (async () => {
        const cookieBudget = (await cookieManager.getCookie())?.value;

        setBudget(cookieBudget ?? '');
        setShipping(getShipping() ?? '');

        console.log(totalPrice);
      })();
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(budgetContainer);
  }, []);

  useEffect(() => {
    const bidPriceInput = document.querySelector<HTMLInputElement>(
      '.BidModal__inputPrice.js-validator-price'
    );
    if (!bidPriceInput) return;
    const bidPrice = calculateTaxExcludedPrice(budget);
    setBidPrice(bidPrice);

    bidPriceInput.value = String(bidPrice);
    bidPriceInput.dispatchEvent(
      new window.KeyboardEvent('keyup', { key: 'a' })
    );
  }, [budget]);

  useEffect(() => {
    const totalPrice = calculateTotalPrice(bidPrice, Number(shipping));
    setTotalPrice(totalPrice);
  }, [bidPrice]);

  return (
    <div className="budget-container">
      <label className="budget-label">
        <span>予算</span>
        <input
          className="budget-input"
          type={'number'}
          onKeyDown={onKeydown}
          onInput={onInput}
          value={budget}
        ></input>
        <span>円</span>
      </label>
      <ShippingRow />
      <TotalPriceRow totalPrice={totalPrice} />
    </div>
  );
};

export default BudgetContainer;
