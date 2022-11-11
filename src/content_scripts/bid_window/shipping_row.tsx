import React, { useEffect } from 'react';
import getShipping from '../../functional/get_shipping';

const ShippingRow = () => {
  const shipping = getShipping();

  useEffect(() => {
    const targetElement = document.querySelector('.shipping-row');
    if (!targetElement) return;
    document.querySelector('#shippingRow')?.append(targetElement);
  }, []);

  return (
    <dl className="BidModal__subTotal shipping-row">
      <dt className="BidModal__left">送料</dt>
      <dd className="BidModal__right">
        : <span>{Number(shipping).toLocaleString()}</span> 円
      </dd>
    </dl>
  );
};

export default ShippingRow;
