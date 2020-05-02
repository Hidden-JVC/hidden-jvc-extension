import browser from 'webextension-polyfill';

export async function getState() {
    const result = await browser.storage.local.get({ state: null });

    if (result.state === null) {
        const state = {
            user: {
                jwt: null,
                name: 'Anonymous'
            },
            hidden: {
                enabled: false,
                view: 'list',
                list: {
                    page: 1
                },
                topic: {
                    page: 1,
                    id: 0
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
