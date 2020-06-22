import browser from 'webextension-polyfill';

import { setState, getState } from '../helpers/storage.js';

import './messages.js';

async function listener(details) {
    const index = details.url.indexOf('?');
    if (index > -1) {
        const query = new URLSearchParams(details.url.substring(index + 1));
        const state = await getState();

        if (query.has('hidden')) {
            state.hidden.enabled = query.get('hidden') === '1';
        }

        if (query.has('view') && ['list', 'topic'].includes(query.get('view'))) {
            state.hidden.view = query.get('view');
        }

        if (query.has('listPage')) {
            state.hidden.list.page = isNaN(query.get('listPage')) ? 1 : parseInt(query.get('listPage'));
        }

        if (query.has('topicId')) {
            state.hidden.topic.id = isNaN(query.get('topicId')) ? 1 : parseInt(query.get('topicId'));
        }

        if (query.has('topicPage')) {
            state.hidden.topic.page = isNaN(query.get('topicPage')) ? 1 : parseInt(query.get('topicPage'));
        }

        if (query.has('topicUserId')) {
            if (query.get('topicUserId') === 'null') {
                state.hidden.topic.userId = null;
            } else {
                state.hidden.topic.userId = isNaN(query.get('topicUserId')) ? 1 : parseInt(query.get('topicUserId'));
            }
        }

        await setState(state);
    }
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ['http://www.jeuxvideo.com/forums/*'], types: ['main_frame'] },
    ['blocking']
);

function redirectListener(details) {
    const hash = details.url.replace('http://www.jeuxvideo.com/hidden-redirect/', '');
    const path = browser.runtime.getURL('hidden-jvc-website/index.html');
    browser.tabs.update(details.tabId, { url: `${path}#/${hash}` });
}

browser.webRequest.onBeforeRequest.addListener(
    redirectListener,
    { urls: ['http://www.jeuxvideo.com/hidden-redirect/*'], types: ['main_frame'] },
    ['blocking']
);

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({ url: 'hidden-jvc-website/index.html' });
});
