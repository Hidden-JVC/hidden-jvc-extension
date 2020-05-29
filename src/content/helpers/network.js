import browser from 'webextension-polyfill';

export async function getRequest(url, queryObject = {}) {
    try {
        const query = new URLSearchParams(queryObject);
        if (query.toString().length > 0) {
            url = `${url}?${query.toString()}`;
        }
        return await browser.runtime.sendMessage({ action: 'get-request', url });
    } catch (err) {
        throw new Error('server down ?');
    }
}

export async function postRequest(url, body, jwt) {
    try {
        return await browser.runtime.sendMessage({ action: 'post-request', url, body, jwt });
    } catch (err) {
        throw new Error('server down ?');
    }
}
