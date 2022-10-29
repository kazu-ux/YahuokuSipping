export const isNumber = (inputValue: string) => {
  const NGKeys = ['e', '.', '+', '-'];
  return !NGKeys.includes(inputValue);
};
