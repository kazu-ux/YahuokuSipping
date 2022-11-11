const getShipping = () => {
  return document.querySelector<HTMLInputElement>('.shipping-input')?.value;
};

export default getShipping;
