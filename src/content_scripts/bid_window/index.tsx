import React from 'react';
import { createRoot } from 'react-dom/client';

import BudgetContainer from './budget_container';

const budgetFormRoot = document.createElement('div');
budgetFormRoot.id = 'budgetForm';
document.querySelector('.BidModal__inputArea')?.prepend(budgetFormRoot);
const root = createRoot(budgetFormRoot);
root.render(<BudgetContainer />);

const shippingRowRoot = document.createElement('div');
shippingRowRoot.id = 'shippingRow';

document
  .querySelector<HTMLInputElement>('.BidModal__totalArea')
  ?.prepend(shippingRowRoot);

const totalPriceRoot = document.createElement('div');
totalPriceRoot.id = 'totalPriceRow';

document
  .querySelector<HTMLInputElement>('.BidModal__totalArea')
  ?.append(totalPriceRoot);
