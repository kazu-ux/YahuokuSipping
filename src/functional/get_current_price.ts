export const getCurrentPrice = () => {
  const targetElement = document.querySelector('.Price__value');
  if (!targetElement) {
    console.log('現在の価格が取得できません');
    return;
  }
  return Number(
    targetElement.childNodes[0].textContent?.replace(/[^0-9]/g, '')
  );
};
