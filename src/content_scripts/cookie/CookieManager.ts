export const CookieManager = (auctionId: string) => {
  const cookieName = auctionId + '_shipping';
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
    setCookie: (shipping: string) => {
      chrome.runtime.sendMessage({
        name: cookieName,
        url: URL,
        value: shipping,
      });
    },
  };
};
