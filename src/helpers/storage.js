function getExtension(data) {
    return new Promise((resolve) => {
        chrome.storage.local.get(data, resolve);
    });
}

function setExtension(data) {
    return new Promise((resolve) => {
        chrome.storage.local.set(data, resolve);
    });
}

function getUserscript() {
    /* eslint-disable-next-line no-undef */
    return GM_getValue('hidden-state', null);
}

function setUserscript(value) {
    /* eslint-disable-next-line no-undef */
    return GM_setValue('hidden-state', value);
}

export async function getState() {
    let state = null;
    /* eslint-disable-next-line no-undef */
    if (process.env.HIDDEN_ENV === 'userscript') {
        state = getUserscript();
    } else {
        const result = await getExtension({ state: null });
        state = result.state;
    }

    if (state === null) {
        const state = {
            user: {
                jwt: null,
                userId: null,
                isAdmin: false,
                moderators: [],
                anonymousName: 'Anonymous',
                registeredName: null,
                favoriteStickers: []
            },
            hidden: {
                enabled: false,
                view: 'list',
                list: {
                    page: 1
                },
                topic: {
                    id: 0,
                    page: 1,
                    userId: null
                }
            }
        };

        await setState(state);
        return state;
    }

    return state;
}

export async function setState(state) {
    /* eslint-disable-next-line no-undef */
    if (process.env.HIDDEN_ENV === 'userscript') {
        state = setUserscript(state);
    } else {
        await setExtension({ state });
    }
}
