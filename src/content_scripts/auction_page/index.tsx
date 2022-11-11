import React from 'react';
import { createRoot } from 'react-dom/client';

import ShippingContainer from './shipping_container';
import '../style.css';

const shippingFormRoot = document.createElement('div');
shippingFormRoot.id = 'shippingForm';

document
  .querySelector('.Price__row')
  ?.insertAdjacentElement('afterend', shippingFormRoot);

const root = createRoot(shippingFormRoot);

root.render(<ShippingContainer />);
