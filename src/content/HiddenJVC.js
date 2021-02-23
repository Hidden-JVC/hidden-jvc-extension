import helpers from './helpers';
import constants from './constants';
import * as storage from '../helpers/storage';

import './scss/main.scss';

class HiddenJVC {
    constructor() {
        this.modules = [];

        this.helpers = helpers;
        this.storage = storage;
        this.constants = constants;
    }

    registerModule(newModule) {
        this.modules.push(newModule);
    }

    async init() {
        const state = await this.storage.getState();
        try {
            this.constants.Runtime.init(state);
        } catch (err) {
            console.error(err);
            this.helpers.createModal(err.message);
            return;
        }

        if (this.constants.Runtime.is410) {
            console.log('410 !');
            return;
        }

        console.log(location.href);

        for (const m of this.modules) {
            if (m.pages === 0 || m.pages & this.constants.Runtime.currentPage) {
                m.init(state).catch((err) => {
                    console.error(err);
                    this.helpers.createModal(err.message);
                });
            }
        }
    }
}

export default new HiddenJVC();
