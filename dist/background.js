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
chrome.runtime.onMessage.addListener((details, _, sendResponse) => {
    chrome.cookies.get(details).then((cookies) => {
        console.log(cookies);
        if (!cookies) {
            setCookies(details);
        }
        sendResponse(cookies?.value);
    });
    return true;
});

/******/ })()
;