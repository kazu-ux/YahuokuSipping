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
    chrome.cookies.set(details).then((res) => {
        // console.log(res);
    });
};
//現在時刻をUnixtimeで返す
const getUnixTime = () => {
    const date = new Date();
    const unixTime = Math.floor(date.getTime() / 1000);
    return unixTime;
};
chrome.runtime.onMessage.addListener((details, _, sendResponse) => {
    console.log(details);
    if (details.value) {
        details.expirationDate = getUnixTime() + 604800;
        setCookies(details);
        return;
    }
    chrome.cookies.get(details).then((cookies) => {
        if (!cookies) {
            details.expirationDate = getUnixTime() + 604800;
            setCookies(details);
        }
        sendResponse(cookies?.value);
    });
    return true;
});

/******/ })()
;