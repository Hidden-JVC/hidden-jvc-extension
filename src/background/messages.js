import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener(handleMessage);

async function handleMessage(message) {
    switch (message.action) {
        case 'get-request':
            return await getRequest(message);
        case 'post-request':
            return await postRequest(message);
    }
}

async function getRequest(message) {
    const headers = buildHeaders(message);
    const response = await fetch(message.url, { headers });
    return await response.json();
}

async function postRequest(message) {
    const headers = buildHeaders(message);
    headers['content-type'] = 'application/json';

    const response = await fetch(message.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(message.body)
    });
    return await response.json();
}

function buildHeaders(message) {
    const headers = {};
    if (message.jwt) {
        headers.authorization = `Bearer ${message.jwt}`;
    }
    return headers;
}
