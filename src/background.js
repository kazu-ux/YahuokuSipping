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
    const detailsForGet = {
        name: details.name,
        url: details.url
    }

    chrome.cookies.get(detailsForGet, async (res) => {
        const tabId = await getTabId();
        if (res) {
            const shippingValue = res.value;
            chrome.tabs.sendMessage(Number(tabId), { shipping: shippingValue, isCookie: true });
            console.log(res);
            console.log(details);
        } else {
            chrome.tabs.sendMessage(Number(tabId), { isCookie: false })
            //setCookies(details);
        }
    })

    if (details.value) {
        setCookies(details);

    }

    return true
})