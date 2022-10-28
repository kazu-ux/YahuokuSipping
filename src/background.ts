type Details = {
  name: string;
  url: string;
  value?: string;
  expirationDate: number;
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
      expirationDate: number;
    },
    _,
    sendResponse
  ) => {
    // インプットフォームが空になっても動作させるため
    if (Number(details.value) >= 0) {
      details.expirationDate = getUnixTime() + 604800;
      setCookies(details);
      return;
    }

    chrome.cookies.get(details).then((cookies) => {
      sendResponse(cookies?.value);
    });

    return true;
  }
);

export {};
