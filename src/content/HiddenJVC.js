import { getState } from '../helpers/storage';

import pageInfo from './modules/PageInfo.js';
import hiddenLogin from './modules/HiddenLogin.js';
import hiddenList from './modules/HiddenList.js';
import hiddenTopic from './modules/HiddenTopic.js';
import hiddenToggler from './modules/HiddenToggler.js';

class HiddenJVC {
    async init() {
        try {
            const state = await getState();

            await hiddenLogin.init(state);
            await pageInfo.init(state);

            await hiddenList.init(state);
            await hiddenTopic.init(state);

            await hiddenToggler.init(state);
        } catch (err) {
            console.error(err);
        }
    }
}

export default new HiddenJVC();
