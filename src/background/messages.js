chrome.runtime.onMessage.addListener(handleMessage);

async function handleMessage(message) {
    switch (message.action) {
        case 'open-website':
            chrome.tabs.create({ url: `hidden-jvc-website/index.html#/${message.path ? message.path : ''}` });
    }
}
