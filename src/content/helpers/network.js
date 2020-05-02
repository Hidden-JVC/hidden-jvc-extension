import browser from 'webextension-polyfill';

export async function getRequest(url, queryObject = {}) {
    const query = new URLSearchParams(queryObject);
    if (query.values.length > 0) {
        url = `${url}?${query.toString()}`;
    }
    return await browser.runtime.sendMessage({ action: 'get-request', url });
}

export async function postRequest(url, body, jwt) {
    return await browser.runtime.sendMessage({ action: 'post-request', url, body, jwt });
}
