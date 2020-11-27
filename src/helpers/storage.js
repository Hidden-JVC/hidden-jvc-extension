import browser from 'webextension-polyfill';

export async function getState() {
    const result = await browser.storage.local.get({ state: null });

    if (result.state === null) {
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

    return result.state;
}

export async function setState(state) {
    await browser.storage.local.set({ state });
}
