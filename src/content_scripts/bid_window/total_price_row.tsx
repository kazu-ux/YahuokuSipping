import React, { useEffect } from 'react';

type Props = { totalPrice: number };

const TotalPriceRow = (props: Props) => {
  useEffect(() => {
    const targetElement = document.querySelector('.totalPriceRow');
    if (!targetElement) return;
    document.querySelector('#totalPriceRow')?.append(targetElement);
  }, []);

  return (
    <dl className="BidModal__total totalPriceRow">
      <dt className="BidModal__left">送料込み金額</dt>
      <dd className="BidModal__right">
        : {props.totalPrice.toLocaleString()} 円
      </dd>
    </dl>
  );
};

export default TotalPriceRow;
