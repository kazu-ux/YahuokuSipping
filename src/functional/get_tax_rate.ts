export const getTaxRate = () => {
  const taxRate = document
    .querySelector('[data-validator-taxrate]')
    ?.getAttribute('data-validator-taxrate');
  if (!taxRate) return 0;
  return Number(taxRate);
};
