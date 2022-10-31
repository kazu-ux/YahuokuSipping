type Details = {
  name: string;
  url: string;
  value?: string;
  expirationDate?: number;
};

const setCookies = (details: Details) => {
  chrome.cookies.set(details);
};
//現在時刻をUnixtimeで返す
const getUnixTime = () => {
  const date = new Date();
  const unixTime = Math.floor(date.getTime() / 1000);
  return unixTime;
};

chrome.runtime.onMessage.addListener(
  (
    details: {
      name: string;
      url: string;
      value?: string;
      expirationDate?: number;
    },
    _,
    sendResponse
  ) => {
    details.expirationDate = getUnixTime() + 604800;
    if (details.value || details.value === '') {
      chrome.cookies.set(details);
      return;
    }
    chrome.cookies
      .get({
        name: details.name,
        url: details.url,
      })
      .then((cookie) => {
        sendResponse(cookie);
      });

    return true;
  }
);

export {};
