import runtime from './runtime.js';
import { getState } from './storage.js';

class HiddenJVC {
    constructor() {
        this.modules = [];
    }

    registerModule(newModule) {
        this.modules.push(newModule);
    }

    async init() {
        try {
            const state = await getState();
            runtime.init(state);

            if (runtime.is410) {
                console.log('410 !');
                return;
            }

            for (const m of this.modules) {
                if (m.pages === 0 || m.pages & runtime.currentPage) {
                    m.init(state).catch((err) => {
                        console.error(err);
                        this.helpers.createModal(err.message);
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export default new HiddenJVC();
