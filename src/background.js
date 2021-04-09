const getUnixTime = () => {
    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);
    return unixTime
}

const getTabId = () => new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        //console.log(tab)
        const tabId = tab[0].id
        resolve(tabId);
    })
})


const setCookies = (details) => {
    chrome.cookies.set(details);
}

chrome.runtime.onMessage.addListener((details) => {
    const cookieDetailsSet = {
        name: "test",
        value: "100",
        url: "https://page.auctions.yahoo.co.jp/",
        expirationDate: getUnixTime() + 300
    }

    const detailsForGet = {
        name: details.name,
        url: details.url
    }

    chrome.cookies.get(detailsForGet, async (res) => {
        if (res && details.isFirst) {
            const tabId = await getTabId();
            const shippingValue = res.value;
            chrome.tabs.sendMessage(Number(tabId), shippingValue);
            console.log(res);
        } else if (!details.isFirst) {
            console.log(details);
            setCookies(details);
        }
    })

    return true
})