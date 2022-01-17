/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

const getTabId = (url) => new Promise((resolve, reject) => {
    chrome.tabs.query({ url: url }, (tab) => {
        const tabId = tab[0].id;
        resolve(tabId);
    });
});
const setCookies = (details) => {
    chrome.cookies.set(details);
};
chrome.runtime.onMessage.addListener((details) => {
    const detailsForGet = {
        name: details.name,
        url: details.url,
    };
    chrome.cookies.get(detailsForGet, async (res) => {
        const tabId = await getTabId(details.auctionUrl);
        if (res) {
            const shippingValue = res.value;
            chrome.tabs.sendMessage(Number(tabId), {
                shipping: shippingValue,
                isCookie: true,
            });
        }
        else {
            chrome.tabs.sendMessage(Number(tabId), { isCookie: false });
        }
    });
    if (details.value) {
        setCookies(details);
    }
    return true;
});

/******/ })()
;