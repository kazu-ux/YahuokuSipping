export const NumberInputForm = (className: string) => {
  const input = document.createElement('input');
  input.type = 'number';
  input.className = className;
  return input;
};
