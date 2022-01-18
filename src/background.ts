const getTabId = (url: string) =>
  new Promise((resolve, reject) => {
    chrome.tabs.query({ url: url }, (tab) => {
      const tabId = tab[0].id;
      resolve(tabId);
    });
  });

const setCookies = (details: any) => {
  chrome.cookies.set(details).then((res) => {
    // console.log(res);
  });
};

chrome.runtime.onMessage.addListener(
  (details: { name: string; url: string; value?: string }, _, sendResponse) => {
    chrome.cookies.get(details).then((cookies) => {
      console.log(cookies);
      if (!cookies) {
        setCookies(details);
      }
      sendResponse(cookies?.value);
    });

    return true;
  }
);
