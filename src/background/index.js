import { setState, getState } from '../content/storage.js';

import './messages.js';

// block all scripts from jvc
chrome.webRequest.onBeforeRequest.addListener(
    blockScripts,
    { urls: ['<all_urls>'], types: ['script'] },
    ['blocking']
);

// read hidden jvc query parameters before redirect
chrome.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ['https://www.jeuxvideo.com/forums/*'], types: ['main_frame'] },
    ['blocking']
);

// external url to redirect to integrated website
chrome.webRequest.onBeforeRequest.addListener(
    redirectListener,
    { urls: ['https://www.jeuxvideo.com/hidden-redirect/*'], types: ['main_frame'] },
    ['blocking']
);

// open integrated website when clicking the extension icon
chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'hidden-jvc-website/index.html#/forums/51/hidden' });
});

function blockScripts(details) {
    const isFromJVCForums = details.documentUrl.startsWith('https://www.jeuxvideo.com/forums/')
        || details.documentUrl.startsWith('https://www.jeuxvideo.com/recherche/forums/');
    if (isFromJVCForums) {
        return { cancel: true };
    }
}

async function listener(details) {
    const [, hash] = details.url.split('#');
    if (hash) {
        const values = hash.split('-');

        const state = await getState();
        state.hidden.enabled = values[0] === '1';
        if (state.hidden.enabled) {
            state.hidden.view = values[1];
            if (state.hidden.view === 'forum') {
                state.hidden.list.page = parseInt(values[3]);
            } else if (state.hidden.view === 'topic') {
                state.hidden.topic.id = parseInt(values[2]);
                state.hidden.topic.page = parseInt(values[3]);
            }
        }
        await setState(state);
    }
}

function redirectListener(details) {
    const hash = details.url.replace('https://www.jeuxvideo.com/hidden-redirect/', '');
    const path = chrome.runtime.getURL('hidden-jvc-website/index.html');
    chrome.tabs.update(details.tabId, { url: `${path}#/${hash}` });
}
