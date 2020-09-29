import browser from 'webextension-polyfill';

export default async function (data) {
    return await browser.runtime.sendMessage(data);
}
