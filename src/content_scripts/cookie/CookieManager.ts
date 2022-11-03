export const CookieManager = (
  auctionId: string,
  priceType: 'shipping' | 'budget'
) => {
  const cookieName = auctionId + '_' + priceType;
  const URL = 'https://page.auctions.yahoo.co.jp/';
  console.log(cookieName, URL);

  return {
    getCookie: async () => {
      const cookie: chrome.cookies.Cookie | null =
        await chrome.runtime.sendMessage({
          name: cookieName,
          url: URL,
        });
      return cookie;
    },
    setCookie: (price: string) => {
      chrome.runtime.sendMessage({
        name: cookieName,
        url: URL,
        value: price,
      });
    },
  };
};
